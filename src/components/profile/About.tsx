"use client";

import { motion } from "framer-motion";

export function About({ about }: { about: string }) {
    if (!about) return null;

    return (
        <section className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest pt-2">About</h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
                    <p className="whitespace-pre-wrap leading-relaxed">
                        {about}
                    </p>
                </div>
            </div>
        </section>
    );
}
