import { NextResponse } from "next/server";
import { getDomainStatus } from "@/lib/vercel";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    if (!domain) {
        return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    try {
        const status = await getDomainStatus(domain);

        if (status.error) {
            return NextResponse.json({ error: status.error }, { status: 400 });
        }

        return NextResponse.json(status);
    } catch (error) {
        console.error("Domain verification failed:", error);
        return NextResponse.json({ error: "Failed to verify domain status" }, { status: 500 });
    }
}
