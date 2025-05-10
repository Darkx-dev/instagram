import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// GET: Get messages for the current user
export async function GET(req: NextRequest) {
  try {
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Extract query parameters
    const url = new URL(req.url);
    const receiverId = url.searchParams.get("receiverId");
    const groupId = url.searchParams.get("groupId");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build the query based on parameters
    const whereClause: any = {};

    if (receiverId) {
      // Direct messages between two users
      whereClause.OR = [
        {
          senderId: userId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: userId,
        },
      ];
    } else if (groupId) {
      // Group messages
      whereClause.groupId = groupId;

      // Verify the user is a member of the group
      const isMember = await prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId,
            groupId,
          },
        },
      });

      if (!isMember) {
        return NextResponse.json(
          { error: "You are not a member of this group" },
          { status: 403 }
        );
      }
    } else {
      // Get all conversations (latest message from each conversation)
      // This is more complex and requires a different approach

      // Get direct conversations
      const directConversations = await prisma.$queryRaw`
        SELECT
          m.*,
          u.username as senderUsername,
          u.fullName as senderFullName,
          u.avatarUrl as senderAvatarUrl,
          r.username as receiverUsername,
          r.fullName as receiverFullName,
          r.avatarUrl as receiverAvatarUrl
        FROM "Message" m
        JOIN "User" u ON m.senderId = u.id
        JOIN "User" r ON m.receiverId = r.id
        WHERE m.id IN (
          SELECT MAX(m2.id)
          FROM "Message" m2
          WHERE
            (m2.senderId = ${userId} OR m2.receiverId = ${userId})
            AND m2.groupId IS NULL
          GROUP BY
            CASE
              WHEN m2.senderId = ${userId} THEN m2.receiverId
              ELSE m2.senderId
            END
        )
        ORDER BY m.createdAt DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      // Get group conversations
      const groupConversations = await prisma.message.findMany({
        where: {
          group: {
            members: {
              some: {
                userId,
              },
            },
          },
          groupId: {
            not: null,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        distinct: ["groupId"],
        take: limit,
        skip,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          group: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              _count: {
                select: {
                  members: true,
                },
              },
            },
          },
        },
      });

      // Combine and sort conversations
      const conversations = [
        ...directConversations,
        ...groupConversations,
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json({
        conversations: conversations.slice(0, limit),
        pagination: {
          page,
          limit,
          hasMore: conversations.length > limit,
        },
      });
    }

    // Get messages based on the where clause
    const messages = await prisma.message.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        group: groupId
          ? {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            }
          : undefined,
      },
    });

    // Get total count for pagination metadata
    const totalMessages = await prisma.message.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalMessages / limit);

    // Mark messages as read if they are sent to the current user
    if (receiverId) {
      await prisma.message.updateMany({
        where: {
          senderId: receiverId,
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    } else if (groupId) {
      // For group messages, we would need a more complex system to track read status per user
      // This is simplified for now
    }

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to get oldest first
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST: Send a message
export async function POST(req: NextRequest) {
  try {
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderId = session.user.id;

    // Parse the request body
    const data = await req.formData();
    const content = data.get("content") as string;
    const receiverId = data.get("receiverId") as string;
    const groupId = data.get("groupId") as string;
    const mediaFile = data.get("media") as File | null;

    // Validate required fields
    if (!content && !mediaFile) {
      return NextResponse.json(
        { error: "Message must have content or media" },
        { status: 400 }
      );
    }

    if (!receiverId && !groupId) {
      return NextResponse.json(
        { error: "Either receiverId or groupId must be provided" },
        { status: 400 }
      );
    }

    if (receiverId && groupId) {
      return NextResponse.json(
        { error: "Cannot specify both receiverId and groupId" },
        { status: 400 }
      );
    }

    // Handle media file if provided
    let mediaUrl = null;
    if (mediaFile) {
      const buffer = Buffer.from(await mediaFile.arrayBuffer());
      mediaUrl = `data:${mediaFile.type};base64,${buffer.toString("base64")}`;
    }

    // Create the message data object
    const messageData: any = {
      content,
      senderId,
      mediaUrl,
    };

    if (receiverId) {
      // Check if receiver exists
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true },
      });

      if (!receiver) {
        return NextResponse.json(
          { error: "Receiver not found" },
          { status: 404 }
        );
      }

      messageData.receiverId = receiverId;
    } else if (groupId) {
      // Check if group exists and user is a member
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
          members: {
            where: { userId: senderId },
          },
        },
      });

      if (!group) {
        return NextResponse.json(
          { error: "Group not found" },
          { status: 404 }
        );
      }

      if (group.members.length === 0) {
        return NextResponse.json(
          { error: "You are not a member of this group" },
          { status: 403 }
        );
      }

      messageData.groupId = groupId;
    }

    // Create the message
    const message = await prisma.message.create({
      data: messageData,
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        receiver: receiverId
          ? {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            }
          : undefined,
        group: groupId
          ? {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json({
      message: "Message sent successfully",
      message,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}