import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(username)) {
      return NextResponse.json({ available: false });
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ available: false });
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { name: username },
    });

    return NextResponse.json({ available: !existingProfile });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Failed to check username" },
      { status: 500 }
    );
  }
}

