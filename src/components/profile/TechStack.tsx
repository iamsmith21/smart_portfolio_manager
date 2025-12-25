"use client";

import { motion } from "framer-motion";

export function TechStack({ skills }: { skills: string[] }) {
    if (skills.length === 0) return null;

    return (
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pt-2">Stack</h2>

                <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                        <span
                            key={skill}
                            className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-black dark:hover:text-white transition-colors cursor-default"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
