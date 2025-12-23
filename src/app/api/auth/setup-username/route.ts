import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9-_]+$/, "Username can only contain letters, numbers, hyphens, and underscores");

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { username } = body;

    const validatedUsername = usernameSchema.parse(username);

    let dbUser = null;
    if (session.user.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true },
      });
    }

    if (!dbUser && session.user.email) {
      dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { profile: true },
      });
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (dbUser.profile) {
      return NextResponse.json(
        { error: "Username already set. You cannot change it." },
        { status: 400 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { name: validatedUsername },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 400 }
      );
    }

    await prisma.profile.create({
      data: {
        userId: dbUser.id,
        name: validatedUsername,
        headline: "",
        about: "",
        skills: [],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Username set successfully",
      username: validatedUsername,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Error setting username:", error);
    return NextResponse.json(
      { error: "Failed to set username" },
      { status: 500 }
    );
  }
}

