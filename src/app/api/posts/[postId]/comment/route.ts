import { authOptions } from "@/configs/next-auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST handler to create a comment on a post
export async function POST(req: NextRequest) {
    try {
        // Extract postId from the URL path (e.g., /api/posts/[postId]/comment)
        const postId = req.nextUrl.pathname.split('/')[3];
        if (!postId) {
            return NextResponse.json({ error: "postId is required" }, { status: 400 });
        }

        // Get the authenticated session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;

        // Parse form data to get comment content
        const formData = await req.formData();
        const content = formData.get("content") as string | null;
        if (!content) {
            return NextResponse.json({ error: "Content is empty" }, { status: 400 });
        }

        // Validate that the post exists
        const postExists = await prisma.post.findUnique({
            where: { id: postId },
        });
        if (!postExists) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Create the comment in the database
        const comment = await prisma.comment.create({
            data: {
                content, // Comment text
                postId,  // Foreign key to Post.id
                authorId: userId, // Foreign key to User.id
            },
        });

        // Return success response with the created comment
        return NextResponse.json({ message: "Comment created successfully", comment }, { status: 200 });
    } catch (error) {
        // Log detailed error for debugging
        if (error instanceof Error) {
            console.error("Detailed Error:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
        } else {
            console.error("Unknown Error:", error);
        }

        // Return error response
        return NextResponse.json(
            { error: "Failed to create comment", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    } finally {
        // Disconnect Prisma client to free resources
        await prisma.$disconnect();
    }
}