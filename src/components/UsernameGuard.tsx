"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function UsernameGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  const publicPages = [
    "/",
    "/auth/signin",
    "/auth/signout",
    "/auth/error",
    "/auth/setup-username",
    "/profile",
  ];

  useEffect(() => {
    if (!pathname) {
      return;
    }

    setIsChecking(false);

    if (status === "loading") {
      return;
    }

    const isPublicPage = publicPages.some((page) => {
      if (page === "/") {
        return pathname === "/";
      }
      return pathname?.startsWith(page);
    });

    if (isPublicPage) {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session) {
      const hasProfile = (session as any).hasProfile;
      if (!hasProfile && pathname !== "/auth/setup-username") {
        router.push("/auth/setup-username");
      }
    }
  }, [status, session, pathname, router]);

  if (isChecking || status === "loading" || !pathname) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isPublicPage = publicPages.some((page) => {
    if (page === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(page);
  });

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (
    status === "authenticated" &&
    session &&
    !(session as any).hasProfile &&
    pathname !== "/auth/setup-username"
  ) {
    return null;
  }

  return <>{children}</>;
}

