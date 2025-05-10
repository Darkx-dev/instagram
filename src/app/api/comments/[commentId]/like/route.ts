import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// POST: Like a comment
export async function POST(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });
    
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    // Check if the user has already liked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
    
    if (existingLike) {
      return NextResponse.json(
        { error: "You have already liked this comment" },
        { status: 400 }
      );
    }
    
    // Create the like
    await prisma.commentLike.create({
      data: {
        userId,
        commentId,
      },
    });
    
    // Create a notification for the comment author (if not liking own comment)
    if (comment.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "comment_like",
          content: "liked your comment",
          userId: comment.authorId, // The user receiving the notification
          relatedUserId: userId, // The user who liked
        },
      });
    }
    
    return NextResponse.json({ message: "Comment liked successfully" });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Failed to like comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Unlike a comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if the comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });
    
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    // Check if the user has liked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
    
    if (!existingLike) {
      return NextResponse.json(
        { error: "You have not liked this comment" },
        { status: 400 }
      );
    }
    
    // Delete the like
    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });
    
    return NextResponse.json({ message: "Comment unliked successfully" });
  } catch (error) {
    console.error("Error unliking comment:", error);
    return NextResponse.json(
      { error: "Failed to unlike comment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
