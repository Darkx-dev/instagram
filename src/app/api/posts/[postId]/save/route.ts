import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// POST: Save a post
export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Check if the user has already saved the post
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    
    if (existingSave) {
      return NextResponse.json(
        { error: "You have already saved this post" },
        { status: 400 }
      );
    }
    
    // Save the post
    await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });
    
    return NextResponse.json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json(
      { error: "Failed to save post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE: Unsave a post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Check if the user has saved the post
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    
    if (!existingSave) {
      return NextResponse.json(
        { error: "You have not saved this post" },
        { status: 400 }
      );
    }
    
    // Unsave the post
    await prisma.savedPost.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    
    return NextResponse.json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving post:", error);
    return NextResponse.json(
      { error: "Failed to unsave post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
