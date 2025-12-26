import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { addDomainToVercel, removeDomainFromVercel } from "@/lib/vercel";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      username,
      headline,
      about,
      workExperience,
      education,
      skills,
      contact,
      projects,
      customDomain,
      theme,
    } = body;

    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

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
      console.error("User not found in database", {
        userId: session.user.id,
        email: session.user.email,
      });
      return NextResponse.json(
        { error: "User not found. Please try signing in again." },
        { status: 404 }
      );
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { name: username },
    });

    if (existingProfile && existingProfile.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "Unauthorized: This profile belongs to another user" },
        { status: 403 }
      );
    }

    const currentDomain = existingProfile?.customDomain || null;
    const newDomain = customDomain ? customDomain.trim() : null;

    if (newDomain !== currentDomain) {
      if (newDomain) {
        const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(newDomain)) {
          return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
        }

        const vercelRes = await addDomainToVercel(newDomain);

        if (vercelRes.error) {
          return NextResponse.json({
            error: vercelRes.error,
          }, { status: 400 });
        }
      }

      if (currentDomain) {
        await removeDomainFromVercel(currentDomain);
      }
    }

    const profile = await prisma.profile.upsert({
      where: { name: username },
      update: {
        userId: dbUser.id,
        headline: headline || "",
        about: about || "",
        customDomain: customDomain || null,
        workExperience: workExperience || null,
        education: education || null,
        skills: skills || [],
        contact: contact || null,
        theme: theme || "minimal",
      },
      create: {
        userId: dbUser.id,
        name: username,
        headline: headline || "",
        about: about || "",
        customDomain: customDomain || null,
        workExperience: workExperience || null,
        education: education || null,
        skills: skills || [],
        contact: contact || null,
        theme: theme || "minimal",
      },
    });

    if (projects && Array.isArray(projects)) {
      await Promise.all(
        projects.map(async (p: { id: string; visible: boolean }) => {
          await prisma.project.update({
            where: { id: p.id },
            data: { visible: p.visible },
          });
        })
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("customDomain")) {
      return NextResponse.json(
        { error: "This domain is already taken by another user." },
        { status: 409 }
      );
    }

    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

