"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToogle";

export function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    // Fluid Transformations
    // Reacts directly to scroll position:
    // 0px -> 1300px (approx 7xl)
    // 150px -> 600px (Pill size)
    const widthResult = useTransform(scrollY, [0, 150], ["1280px", "600px"]);

    // Opacity of the extra text: fades out quickly
    const textOpacity = useTransform(scrollY, [0, 50], [1, 0]);
    const textDisplay = useTransform(scrollY, (value: number) => value > 50 ? "none" : "inline-block");
    const textWidth = useTransform(scrollY, [0, 50], ["auto", "0px"]);

    // We still need state for the "Hide entirely" logic based on direction
    const [lastY, setLastY] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const difference = latest - lastY;
        const isScrollingDown = difference > 0;

        // Hide if scrolling down AND past 150px
        if (isScrollingDown && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setLastY(latest);
    });

    return (
        <motion.div
            variants={{
                visible: { y: 0 },
                hidden: { y: "-150%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <motion.nav
                style={{ width: widthResult }} // Driven directly by scroll
                className="pointer-events-auto flex items-center justify-between p-2 pl-6 bg-secondary/30 dark:bg-secondary/40 backdrop-blur-md border border-border/50 rounded-full shadow-lg ring-1 ring-white/10 transition-all"
            >
                {/* Logo Area */}
                <Link
                    href="/"
                    className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">
                        SPM
                    </span>
                    <motion.span
                        style={{
                            opacity: textOpacity,
                            width: textWidth,
                            display: textDisplay
                        }}
                        className="hidden sm:inline text-muted-foreground text-sm font-normal overflow-hidden whitespace-nowrap"
                    >
                        | Smart Portfolio Manager
                    </motion.span>
                </Link>

                {/* Actions Area */}
                <div className="flex items-center gap-2">
                    <div className="pr-2 border-r border-border/50">
                        <AuthButton />
                    </div>
                    <ThemeToggle />
                </div>
            </motion.nav>
        </motion.div>
    );
}
