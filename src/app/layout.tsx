import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import ThemeToggle from "../components/ThemeToogle";
import AuthButton from "../components/AuthButton";
import { Providers } from "../components/Providers";


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
  description: "JUST DO IT? FOR FUNNN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-black dark:text-white`}
      >
        <Providers>
        <ThemeProvider>
          <nav className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <h1 className="font-bold text-xl">My Portfolio</h1>
            <ThemeToggle />
          </nav>
          <main className="p-4">{children}</main>
        </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}