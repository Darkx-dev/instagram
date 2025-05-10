import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Get a user's followers
export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    
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
    
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get the user's followers with pagination
    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        createdAt: true,
      },
    });
    
    // Get total count for pagination metadata
    const totalFollowers = await prisma.follow.count({
      where: { followingId: user.id },
    });
    
    const totalPages = Math.ceil(totalFollowers / limit);
    
    return NextResponse.json({
      followers: followers.map((follow) => ({
        ...follow.follower,
        followedAt: follow.createdAt,
      })),
      pagination: {
        page,
        limit,
        totalFollowers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { error: "Failed to fetch followers" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
