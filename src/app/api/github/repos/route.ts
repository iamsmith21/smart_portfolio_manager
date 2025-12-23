import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const perPage = searchParams.get("per_page") || "100";

  const res = await fetch(
    `https://api.github.com/user/repos?per_page=${perPage}&sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `token ${session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}