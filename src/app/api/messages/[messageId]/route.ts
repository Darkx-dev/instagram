import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// GET: Get a message by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Find the message by ID
    const message = await prisma.message.findUnique({
      where: { id: messageId },
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
        group: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
    
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    // Check if the user has access to this message
    const hasAccess =
      message.senderId === userId ||
      message.receiverId === userId ||
      (message.groupId &&
        (await prisma.groupMember.findUnique({
          where: {
            userId_groupId: {
              userId,
              groupId: message.groupId,
            },
          },
        })));
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have access to this message" },
        { status: 403 }
      );
    }
    
    // Mark the message as read if the user is the receiver and it's not read yet
    if (message.receiverId === userId && !message.isRead) {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });
    }
    
    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error fetching message:", error);
    return NextResponse.json(
      { error: "Failed to fetch message" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Delete a message
export async function DELETE(
  req: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const { messageId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Find the message to verify ownership
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { senderId: true },
    });
    
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    // Check if the user is the sender of the message
    if (message.senderId !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own messages" },
        { status: 403 }
      );
    }
    
    // Delete the message
    await prisma.message.delete({
      where: { id: messageId },
    });
    
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
