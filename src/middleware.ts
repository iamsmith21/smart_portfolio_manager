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
        const response = await fetch(apiUrl, { cache: 'no-store' });

        if (response.ok) {
            const data = await response.json();

            if (data.username) {
                // RESTRICT: Only allow root path for custom domains.
                // If they try to visit /settings, /login, etc., redirect them to their portfolio home.
                if (url.pathname !== "/") {
                    return NextResponse.redirect(new URL("/", request.url));
                }
                return NextResponse.rewrite(new URL(`/${data.username}`, request.url));
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