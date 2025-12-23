import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToogle";
import AuthButton from "../components/AuthButton";
import { Providers } from "../components/Providers";
import { UsernameGuard } from "../components/UsernameGuard";
import Link from "next/link";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Portfolio Manager",
  description: "Making Life Bit Easier",
  verification: {
    google: "9hAhoTDnTTLEEPIwaWULZqeYHZTGz0-wTo66SzFSgg8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white`}
      >
        <Providers>
        <ThemeProvider>
          <UsernameGuard>
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                  Smart Portfolio Manager
                </Link>
                <div className="flex items-center gap-4">
                  <AuthButton />
                </div>
              </div>
            </nav>
            <ThemeToggle />
            <main>{children}</main>
          </UsernameGuard>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
