import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";

// GET: Get saved posts for the current user
export async function GET(req: NextRequest) {
  try {
    // Get the current session to check if the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    
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
    
    // Get saved posts with pagination
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
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
            images: {
              orderBy: { order: "asc" },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });
    
    // Get total count for pagination metadata
    const totalSavedPosts = await prisma.savedPost.count({
      where: { userId },
    });
    
    const totalPages = Math.ceil(totalSavedPosts / limit);
    
    // Transform the data to return just the posts with saved information
    const posts = savedPosts.map((savedPost) => ({
      ...savedPost.post,
      savedAt: savedPost.createdAt,
      isSaved: true,
    }));
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalSavedPosts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved posts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
