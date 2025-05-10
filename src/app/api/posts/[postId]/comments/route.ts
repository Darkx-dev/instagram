import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Get comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;
    
    // Extract pagination parameters from query string
    const url = new URL(req.url);
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
    
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Get comments for the post with pagination
    // Only get top-level comments (no parent comment)
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentCommentId: null, // Only top-level comments
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
    });
    
    // Get total count for pagination metadata
    const totalComments = await prisma.comment.count({
      where: {
        postId,
        parentCommentId: null, // Only top-level comments
      },
    });
    
    const totalPages = Math.ceil(totalComments / limit);
    
    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
