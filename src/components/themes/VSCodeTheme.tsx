"use client";
import React, { useState } from "react";
import {
    Files, Search, GitGraph, Bug, Blocks, Settings,
    ChevronRight, ChevronDown, X, FileJson, FileCode, FileText,
    Menu, Split, MoreHorizontal, LayoutPanelLeft, TerminalSquare
} from "lucide-react";

export function VSCodeTheme({ profile, projects }: { profile: any; projects: any[] }) {
    const [activeFile, setActiveFile] = useState("README.md");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // File Content Components
    const renderContent = () => {
        switch (activeFile) {
            case "README.md":
                return <ReadmeContent profile={profile} />;
            case "projects.ts":
                return <ProjectsContent projects={projects} />;
            case "experience.json":
                return <ExperienceContent work={profile.workExperience} />;
            case "contact.env":
                return <ContactContent contact={profile.contact} />;
            default:
                return <ReadmeContent profile={profile} />;
        }
    }

    return (
        <div className="flex h-screen w-full bg-[#1e1e1e] text-[#cccccc] font-mono text-sm overflow-hidden selection:bg-[#264f78]">

            {/* Activity Bar (Leftmost Slim Icons) */}
            <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 z-20">
                <IconWrapper active={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)}><Files className="w-6 h-6" /></IconWrapper>
                <IconWrapper><Search className="w-6 h-6 opacity-60 hover:opacity-100" /></IconWrapper>
                <IconWrapper><GitGraph className="w-6 h-6 opacity-60 hover:opacity-100" /></IconWrapper>
                <IconWrapper><Bug className="w-6 h-6 opacity-60 hover:opacity-100" /></IconWrapper>
                <IconWrapper><Blocks className="w-6 h-6 opacity-60 hover:opacity-100" /></IconWrapper>
                <div className="mt-auto">
                    <IconWrapper><Settings className="w-6 h-6 opacity-60 hover:opacity-100" /></IconWrapper>
                </div>
            </div>

            {/* Sidebar (Explorer) */}
            {sidebarOpen && (
                <div className="w-60 bg-[#252526] flex flex-col shrink-0 border-r border-[#3e3e42] transition-all">
                    <div className="p-3 text-xs uppercase font-bold tracking-wider text-[#bbbbbb] flex justify-between items-center">
                        Explorer
                        <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                    </div>

                    {/* Folder Header */}
                    <div className="px-1 py-1 flex items-center gap-1 cursor-pointer bg-[#37373d] text-white">
                        <ChevronDown className="w-4 h-4" />
                        <span className="font-bold text-xs uppercase">PORTFOLIO</span>
                    </div>

                    {/* Files List */}
                    <div className="mt-1">
                        <FileItem name="README.md" icon={<FileText className="w-4 h-4 text-blue-400" />} active={activeFile === "README.md"} onClick={() => setActiveFile("README.md")} />
                        <FileItem name="projects.ts" icon={<FileCode className="w-4 h-4 text-yellow-400" />} active={activeFile === "projects.ts"} onClick={() => setActiveFile("projects.ts")} />
                        <FileItem name="experience.json" icon={<FileJson className="w-4 h-4 text-yellow-200" />} active={activeFile === "experience.json"} onClick={() => setActiveFile("experience.json")} />
                        <FileItem name="contact.env" icon={<Settings className="w-4 h-4 text-purple-400" />} active={activeFile === "contact.env"} onClick={() => setActiveFile("contact.env")} />
                    </div>

                    {/* Open Editors Section (Bottom of Sidebar) */}
                    <div className="mt-auto border-t border-[#3e3e42]">
                        <div className="px-1 py-1 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e]">
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase">TIMELINE</span>
                        </div>
                        <div className="px-1 py-1 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e]">
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase">OUTLINE</span>
                        </div>
                        <div className="px-1 py-1 flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e]">
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-bold text-xs uppercase">NPM SCRIPTS</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Edit Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative">

                {/* Tab Bar */}
                <div className="flex bg-[#252526] overflow-x-auto no-scrollbar">
                    <TabItem name="README.md" icon={<FileText className="w-3 h-3 text-blue-400" />} active={activeFile === "README.md"} onClick={() => setActiveFile("README.md")} />
                    <TabItem name="projects.ts" icon={<FileCode className="w-3 h-3 text-yellow-400" />} active={activeFile === "projects.ts"} onClick={() => setActiveFile("projects.ts")} />
                    <TabItem name="experience.json" icon={<FileJson className="w-3 h-3 text-yellow-200" />} active={activeFile === "experience.json"} onClick={() => setActiveFile("experience.json")} />
                    <TabItem name="contact.env" icon={<Settings className="w-3 h-3 text-purple-400" />} active={activeFile === "contact.env"} onClick={() => setActiveFile("contact.env")} />
                </div>

                {/* Breadcrumb / Toolbar */}
                <div className="h-6 flex items-center px-4 bg-[#1e1e1e] text-[#7d7d7d] text-xs gap-2 border-b border-[#1e1e1e] shadow-sm">
                    <span>src</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>portfolio</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white">{activeFile}</span>
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-y-auto p-0">
                    <div className="flex min-h-full">
                        {/* Line Numbers */}
                        <div className="w-12 text-right pr-4 pt-4 text-[#858585] select-none text-xs leading-6 bg-[#1e1e1e] shrink-0 border-r border-[#1e1e1e]">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                        </div>

                        {/* Editor Surface */}
                        <div className="flex-1 pt-4 pl-4 font-mono text-sm leading-6 pb-20">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-3 shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1 cursor-pointer">
                            <GitGraph className="w-3 h-3" />
                            <span>main*</span>
                        </div>
                        <div className="flex items-center gap-1 hover:bg-[#1f8ad2] px-1 cursor-pointer">
                            <X className="w-3 h-3 rounded-full border border-white p-[1px]" />
                            <span>0</span>
                            <Settings className="w-3 h-3" />
                            <span>0</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">Ln 1, Col 1</span>
                        <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">UTF-8</span>
                        <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer">TypeScript React</span>
                        <span className="hover:bg-[#1f8ad2] px-1 cursor-pointer"><Settings className="w-3 h-3" /> Prettier</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

// --- Content Components (Syntax Highlighting Sim) ---

function ReadmeContent({ profile }: { profile: any }) {
    return (
        <div className="max-w-3xl text-[#cccccc]">
            <div className="text-[#4ec9b0] mb-4"># {profile.name}</div>
            <div className="mb-8 pl-4 border-l-2 border-[#6a9955]">
                <span className="text-[#ce9178]">&gt; {profile.headline}</span>
            </div>

            <div className="text-[#569cd6] font-bold mb-2">## About Me</div>
            <div className="whitespace-pre-wrap text-[#9cdcfe] mb-8 leading-relaxed">
                {profile.about}
            </div>

            <div className="text-[#569cd6] font-bold mb-2">## Tech Stack</div>
            <div className="flex flex-wrap gap-2 mb-8">
                {profile.skills?.map((s: string) => (
                    <code key={s} className="bg-[#2d2d2d] px-1 rounded text-[#ce9178] text-xs">`{s}`</code>
                ))}
            </div>

            <div className="text-[#6a9955] italic">
                {`<!-- This portfolio is auto-generated from my profile data. -->`}
                <br />
                {`<!-- Feel free to explore the other files in the explorer! -->`}
            </div>
        </div>
    )
}

function ProjectsContent({ projects }: { projects: any[] }) {
    return (
        <div className="whitespace-pre">
            <span className="text-[#c586c0]">import</span>{" "}
            <span className="text-[#9cdcfe]">{`{ Project }`}</span>{" "}
            <span className="text-[#c586c0]">from</span>{" "}
            <span className="text-[#ce9178]">'./types'</span>;<br /><br />

            <span className="text-[#c586c0]">export const</span>{" "}
            <span className="text-[#dcdcaa]">projects</span>:{" "}
            <span className="text-[#4ec9b0]">Project[]</span>{" "}
            <span className="text-[#d4d4d4]">= [</span><br />

            {projects.map((p) => (
                <div key={p.id} className="ml-4 mb-2">
                    <span className="text-[#da70d6]">{'{'}</span><br />
                    <span className="ml-4 text-[#9cdcfe]">id:</span> <span className="text-[#b5cea8]">{p.id}</span>,<br />
                    <span className="ml-4 text-[#9cdcfe]">name:</span> <span className="text-[#ce9178]">"{p.name}"</span>,<br />
                    <span className="ml-4 text-[#9cdcfe]">tags:</span> [<span className="text-[#ce9178]">{p.tech?.map((t: string) => `"${t}"`).join(", ")}</span>],<br />
                    <span className="ml-4 text-[#9cdcfe]">url:</span> <span className="text-[#ce9178]"><a href={p.repoUrl} target="_blank" className="underline decoration-dotted cursor-pointer hover:text-[#4fc1ff]">"{p.repoUrl || '#'}"</a></span>,<br />
                    <span className="ml-4 text-[#6a9955]">// {p.description}</span><br />
                    <span className="text-[#da70d6]">{'}'}</span>,
                </div>
            ))}
            <span className="text-[#d4d4d4]">];</span>
        </div>
    )
}

function ExperienceContent({ work }: { work: any[] }) {
    if (!work || work.length === 0) return <div className="text-[#6a9955]">// No experience data found.</div>;
    return (
        <div className="whitespace-pre font-mono">
            <span className="text-[#d4d4d4]">[</span><br />
            {work.map((job, i) => (
                <div key={i} className="ml-4 mb-2">
                    <span className="text-[#da70d6]">{'{'}</span><br />
                    <span className="ml-4 text-[#9cdcfe]">"company":</span> <span className="text-[#ce9178]">"{job.company}"</span>,<br />
                    <span className="ml-4 text-[#9cdcfe]">"role":</span> <span className="text-[#ce9178]">"{job.role}"</span>,<br />
                    <span className="ml-4 text-[#9cdcfe]">"period":</span> <span className="text-[#ce9178]">"{job.startDate} - {job.endDate || 'Present'}"</span>,<br />
                    <span className="ml-4 text-[#9cdcfe]">"description":</span> <span className="text-[#ce9178]">"{job.description}"</span><br />
                    <span className="text-[#da70d6]">{'}'}</span>{i < work.length - 1 ? "," : ""}
                </div>
            ))}
            <span className="text-[#d4d4d4]">]</span>
        </div>
    )
}

function ContactContent({ contact }: { contact: any }) {
    if (!contact) return <div className="text-[#6a9955]"># No contact info</div>
    return (
        <div className="whitespace-pre">
            <span className="text-[#6a9955]"># Environment Variables specific to Contact</span><br /><br />
            <span className="text-[#9cdcfe]">GITHUB_URL</span>=<span className="text-[#ce9178]"><a href={contact.github || '#'} target="_blank" className="hover:underline">{contact.github || '""'}</a></span><br />
            <span className="text-[#9cdcfe]">LINKEDIN_URL</span>=<span className="text-[#ce9178]"><a href={contact.linkedin || '#'} target="_blank" className="hover:underline">{contact.linkedin || '""'}</a></span><br />
            <span className="text-[#9cdcfe]">EMAIL_ADDRESS</span>=<span className="text-[#ce9178]"><a href={`mailto:${contact.email}`} className="hover:underline">{contact.email || '""'}</a></span><br />
            <span className="text-[#9cdcfe]">PORTFOLIO_URL</span>=<span className="text-[#ce9178]"><a href={contact.website} target="_blank" className="hover:underline">{contact.website || '""'}</a></span><br />
            <span className="text-[#9cdcfe]">LOCATION</span>=<span className="text-[#ce9178]">"{contact.location || "Remote"}"</span><br />
        </div>
    )
}

// --- UI Helpers ---

function IconWrapper({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`cursor-pointer p-3 mb-2 border-l-2 w-full flex justify-center hover:text-white transition-colors ${active ? 'border-white text-white' : 'border-transparent text-[#858585]'}`}
        >
            {children}
        </div>
    )
}

function FileItem({ name, icon, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-1 cursor-pointer text-xs ${active ? 'bg-[#37373d] text-white' : 'text-[#cccccc] hover:bg-[#2a2d2e]'}`}
        >
            {icon}
            <span>{name}</span>
        </div>
    )
}

function TabItem({ name, icon, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] border-r border-[#252526] cursor-pointer text-xs select-none ${active ? 'bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]' : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2d2e]'}`}
        >
            {icon}
            <span>{name}</span>
            <X className={`w-3 h-3 ml-auto opacity-0 ${active && 'opacity-100 hover:bg-[#454545] rounded-sm'}`} />
        </div>
    )
}
