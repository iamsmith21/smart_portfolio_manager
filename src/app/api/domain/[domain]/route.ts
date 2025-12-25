import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ domain: string }> }
) {
    const { domain } = await params;

    const profile = await prisma.profile.findUnique({
        where: {
            customDomain: domain,
        },
        select: { name: true },
    });

    if (!profile) {
        return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }
    return NextResponse.json({ username: profile.name });
}