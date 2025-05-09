import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/configs/next-auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        // Step 1: Get the session
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const authorId = session.user.id;

        // Step 2: Parse FormData
        const formData = await req.formData();
        const caption = formData.get("caption") as string | null;
        const files = formData.getAll("files") as File[];
        // console.log("FormData - Caption:", caption, "Files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));

        if (!files.length) {
            return NextResponse.json({ error: "No images provided" }, { status: 400 });
        }

        // Step 3: Convert image files to Base64 (your working code)
        const base64Files = await Promise.all(
            files
                .filter((file) => file.type.startsWith("image/"))
                .map(async (file) => {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
                    // console.log(`Converted ${file.name} to Base64, length: ${base64.length}`); // Debug
                    return { name: file.name, base64 };
                })
        );

        if (!base64Files.length) {
            return NextResponse.json({ error: "No valid images provided" }, { status: 400 });
        }

        // Step 5: Create Post with PostImages
        const post = await prisma.post.create({
            data: {
                caption,
                authorId,
                images: {
                    create: base64Files.map((file, index) => ({
                        imageUrl: file.base64,
                        order: index,
                    })),
                },
            },
            include: { images: { orderBy: { order: "asc" } } },
        });

        return NextResponse.json({ message: "Post created", post });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Detailed Error:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
        } else {
            console.error("Unknown Error:", error);
        }
        return NextResponse.json(
            { error: "Failed to process", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(req: NextRequest) {
    try {
        // Extract query parameters
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1", 10);
        const limit = parseInt(url.searchParams.get("limit") || "10", 10);
        const authorId = url.searchParams.get("authorId");

        // Validate inputs
        if (!authorId) {
            return NextResponse.json({ error: "authorId is required" }, { status: 400 });
        }
        if (page < 1 || limit < 1) {
            return NextResponse.json({ error: "Invalid page or limit" }, { status: 400 });
        }

        // Calculate skip
        const skip = (page - 1) * limit;

        // Fetch posts with pagination
        const posts = await prisma.post.findMany({
            where: { authorId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" }, // Sort by newest first
            include: { images: { orderBy: { order: "asc" } } }, // Include images
        });

        // Get total count for pagination metadata
        const totalPosts = await prisma.post.count({ where: { authorId } });
        const totalPages = Math.ceil(totalPosts / limit);

        return NextResponse.json({
            message: "Found posts",
            posts,
            pagination: {
                page,
                limit,
                totalPosts,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Detailed Error:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
        } else {
            console.error("Unknown Error:", error);
        }
        return NextResponse.json(
            {
                error: "Failed to find posts",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}