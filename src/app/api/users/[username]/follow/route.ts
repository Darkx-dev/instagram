import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// POST: Follow a user
export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followerId = session.user.id;

    // Find the user to follow
    const userToFollow = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToFollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent users from following themselves
    if (followerId === userToFollow.id) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Create the follow relationship
    await prisma.follow.create({
      data: {
        followerId,
        followingId: userToFollow.id,
      },
    });

    // Create a notification for the followed user
    await prisma.notification.create({
      data: {
        type: "follow",
        content: "started following you",
        userId: userToFollow.id, // The user receiving the notification
        relatedUserId: followerId, // The user who followed
      },
    });

    return NextResponse.json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Unfollow a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followerId = session.user.id;

    // Find the user to unfollow
    const userToUnfollow = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToUnfollow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if actually following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userToUnfollow.id,
        },
      },
    });

    if (!existingFollow) {
      return NextResponse.json(
        { error: "Not following this user" },
        { status: 400 }
      );
    }

    // Delete the follow relationship
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userToUnfollow.id,
        },
      },
    });

    return NextResponse.json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}