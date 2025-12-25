import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    let hostname = request.headers.get("host") || "";

    if (hostname.includes(":")) {
        hostname = hostname.split(":")[0];
    }

    const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost";

    if (hostname === appDomain) {
        return NextResponse.next();
    }

    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    try {
        const apiUrl = `${url.origin}/api/domain/${hostname}`;
        const response = await fetch(apiUrl);

        if (response.ok) {
            const data = await response.json();

            if (data.username) {
                return NextResponse.rewrite(new URL(`/${data.username}${url.pathname}`, request.url));
            }
        }
    } catch (error) {
        console.error("Middleware domain lookup failed:", error);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};