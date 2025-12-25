"use client";

import { Star, GitFork, ArrowUpRight } from "lucide-react";
import ProjectImage from "./ProjectImage";

interface Project {
    id: string;
    name: string;
    description: string;
    repoUrl: string;
    stars: number;
    forks: number;
    tech: string[];
    highlights: string[];
    featured?: boolean;
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
    if (projects.length === 0) return null;

    return (
        <section className="max-w-5xl mx-auto px-6 py-20 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mb-12">
                <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Selected Work</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-xl">
                    A collection of open source libraries, internal tools, and production applications.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <a
                        key={project.id}
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300"
                    >
                        {/* Image Area */}
                        <div className="h-40 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 bg-zinc-100 dark:bg-black">
                            <ProjectImage repoUrl={project.repoUrl} projectName={project.name} />
                            <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {project.name}
                                </h3>
                                <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors" />
                            </div>

                            <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 flex-1">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.slice(0, 3).map(t => (
                                    <span key={t} className="text-[10px] text-zinc-500 px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-transparent">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    <span>{project.stars}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <GitFork className="w-3 h-3" />
                                    <span>{project.forks}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
