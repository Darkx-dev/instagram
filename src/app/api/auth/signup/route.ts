import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    username: string,
    email: string,
    password: string,
    fullName: string,
}

export async function POST(req: NextRequest) {
    const { username, email, password, fullName } = await req.json() as RequestBody;

    if (!email || !username || !password || !fullName) {
        return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    })

    if (existingUser) {
        return NextResponse.json({ error: "User already exists." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            fullName,
            password: hashedPassword
        }
    })

    return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } })
}