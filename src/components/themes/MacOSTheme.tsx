"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Square, Folder, Github, Globe, Mail, Linkedin, Terminal, User, Briefcase, GraduationCap, Settings, Moon, Sun, Image as ImageIcon } from "lucide-react";

export function MacOSTheme({ profile, projects }: { profile: any; projects: any[] }) {
    // Supports multiple open windows
    // "about" is open by default
    const [openWindows, setOpenWindows] = useState<string[]>(["about"]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>("about");
    const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);

    const [time, setTime] = useState(new Date());

    // System Settings State
    const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070");
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Clock tick
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleMinimize = (id: string) => {
        if (minimizedWindows.includes(id)) {
            // Restore
            setMinimizedWindows(minimizedWindows.filter((w) => w !== id));
            setActiveWindowId(id);
        } else {
            // Minimize
            setMinimizedWindows([...minimizedWindows, id]);
            if (activeWindowId === id) {
                setActiveWindowId(null);
            }
        }
    };

    const openApp = (id: string) => {
        if (!openWindows.includes(id)) {
            setOpenWindows([...openWindows, id]);
        }
        // Restore if minimized
        if (minimizedWindows.includes(id)) {
            setMinimizedWindows(minimizedWindows.filter(w => w !== id));
        }
        // Bring to front
        setActiveWindowId(id);
    };

    const closeWindow = (id: string) => {
        setOpenWindows(openWindows.filter((w) => w !== id));
        if (activeWindowId === id) {
            setActiveWindowId(null);
        }
    };

    const focusWindow = (id: string) => {
        setActiveWindowId(id);
    };

    return (
        <div className={`h-screen w-full bg-cover bg-center overflow-hidden font-sans text-sm selection:bg-blue-500/30 ${isDarkMode ? 'dark' : ''}`} style={{ backgroundImage: `url('${wallpaper}')` }}>

            {/* --- Top Bar --- */}
            <div className={`h-7 backdrop-blur-md flex items-center justify-between px-4 shadow-sm z-50 relative select-none ${isDarkMode ? 'bg-black/40 text-white' : 'bg-white/40 text-black/80'}`}>
                <div className="flex items-center gap-4 font-medium cursor-default">
                    <span className="font-bold text-lg"></span>
                    <span className="hidden sm:inline font-bold">
                        {activeWindowId === "about" ? "About Me" :
                            activeWindowId === "projects" ? "Finder" :
                                activeWindowId === "experience" ? "TextEdit" :
                                    activeWindowId === "settings" ? "System Settings" : "Finder"}
                    </span>
                    <span className="hidden sm:inline opacity-90 hover:opacity-100">File</span>
                    <span className="hidden sm:inline opacity-90 hover:opacity-100">Edit</span>
                    <span className="hidden sm:inline opacity-90 hover:opacity-100">View</span>
                    <span className="hidden sm:inline opacity-90 hover:opacity-100">Window</span>
                    <span className="hidden sm:inline opacity-90 hover:opacity-100">Help</span>
                </div>
                <div className="flex items-center gap-3 cursor-default">
                    <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* --- Desktop Area --- */}
            <div className="p-4 grid grid-cols-3 sm:grid-cols-1 gap-6 items-start content-start h-[calc(100vh-80px)] w-fit z-0 relative">

                {/* Desktop Icons */}
                <DesktopIcon label="About Me" icon={<User className="text-blue-400" />} onClick={() => openApp("about")} />
                <DesktopIcon label="Projects" icon={<Folder className="text-blue-400" />} onClick={() => openApp("projects")} />
                <DesktopIcon label="Experience" icon={<Briefcase className="text-blue-400" />} onClick={() => openApp("experience")} />
                <DesktopIcon label="Settings" icon={<Settings className="text-gray-400" />} onClick={() => openApp("settings")} />

                {profile.customDomain && (
                    <a href={`https://${profile.customDomain}`} target="_blank" className="group flex flex-col items-center gap-1 w-20 cursor-pointer text-shadow-sm">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-white/20 transition-all">
                            <Globe className="text-blue-400 w-8 h-8 drop-shadow-md" />
                        </div>
                        <span className="text-white text-xs font-medium drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full">{profile.customDomain}</span>
                    </a>
                )}
            </div>

            {/* --- Windows Layer --- */}
            <AnimatePresence>
                {openWindows.map((windowId) => {
                    const isMinimized = minimizedWindows.includes(windowId);
                    const isActive = activeWindowId === windowId;
                    const zIndex = isActive ? 40 : 10; // Simple z-index logic: active is on top.

                    if (isMinimized) return null;

                    if (windowId === "about") {
                        return (
                            <OSWindow
                                key="about"
                                title={`About ${profile.name}`}
                                id="about"
                                onClose={() => closeWindow("about")}
                                onMinimize={() => toggleMinimize("about")}
                                isActive={isActive}
                                onClick={() => focusWindow("about")}
                                zIndex={zIndex}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-1/3 text-center">
                                        <div className="w-24 h-24 mx-auto bg-zinc-200 rounded-full mb-4 overflow-hidden shadow-inner">
                                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                        </div>
                                        <h2 className="text-xl font-bold text-zinc-800">{profile.name}</h2>
                                        <p className="text-zinc-500 mb-4">{profile.headline}</p>
                                        <div className="flex justify-center gap-3 text-zinc-600">
                                            {profile.user?.accounts?.[0] && (
                                                <a href={`https://github.com/${profile.customDomain || profile.name}`} target="_blank" className="hover:text-black hover:scale-110 transition-transform"><Github className="w-5 h-5" /></a>
                                            )}
                                            <button className="hover:text-blue-500 hover:scale-110 transition-transform"><Mail className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-2/3 border-l border-zinc-100 pl-0 md:pl-6">
                                        <h3 className="font-semibold mb-2 text-lg text-zinc-800">Bio</h3>
                                        <p className="whitespace-pre-wrap leading-relaxed text-zinc-600">{profile.about}</p>

                                        <div className="mt-6">
                                            <h3 className="font-semibold mb-2 text-zinc-800">Skills</h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {Array.isArray(profile.skills) && profile.skills.map((s: string) => (
                                                    <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </OSWindow>
                        );
                    }

                    if (windowId === "projects") {
                        return (
                            <OSWindow
                                key="projects"
                                title="Finder - Projects"
                                id="projects"
                                width="max-w-4xl"
                                onClose={() => closeWindow("projects")}
                                onMinimize={() => toggleMinimize("projects")}
                                isActive={isActive}
                                onClick={() => focusWindow("projects")}
                                zIndex={zIndex}
                                initialX={50}
                                initialY={50}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {projects.map((p) => (
                                        <a href={p.repoUrl} target="_blank" key={p.id} className="group p-3 hover:bg-blue-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-all flex flex-col gap-2">
                                            <div className="w-10 h-10 text-blue-400 fill-blue-400/20 drop-shadow-sm">
                                                <Folder className="w-full h-full" />
                                            </div>
                                            <div>
                                                <div className="font-medium truncate text-zinc-700">{p.name}</div>
                                                <div className="text-xs text-zinc-400 flex items-center gap-2">
                                                    <span>★ {p.stars}</span>
                                                    {p.tech?.[0] && <span>• {p.tech[0]}</span>}
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    {projects.length === 0 && (
                                        <div className="col-span-3 text-center py-12 text-zinc-400 italic">
                                            No projects found in this folder...
                                        </div>
                                    )}
                                </div>
                            </OSWindow>
                        );
                    }

                    if (windowId === "experience") {
                        return (
                            <OSWindow
                                key="experience"
                                title="Experience.txt"
                                id="experience"
                                onClose={() => closeWindow("experience")}
                                onMinimize={() => toggleMinimize("experience")}
                                isActive={isActive}
                                onClick={() => focusWindow("experience")}
                                zIndex={zIndex}
                                initialX={100}
                                initialY={100}
                            >
                                <div className="space-y-6 font-mono text-sm">
                                    {profile.workExperience?.map((job: any, i: number) => (
                                        <div key={i} className="pb-4 border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 p-2 rounded -mx-2 transition-colors">
                                            <div className="font-bold flex justify-between text-zinc-800">
                                                <span>{job.role} @ {job.company}</span>
                                                <span className="text-zinc-400 text-xs">{job.start}</span>
                                            </div>
                                            <p className="text-zinc-600 mt-1 pl-4 border-l-2 border-zinc-200">{job.description}</p>
                                        </div>
                                    ))}
                                    {(!profile.workExperience || profile.workExperience.length === 0) && (
                                        <p className="text-zinc-400 italic">-- No experience records found --</p>
                                    )}
                                </div>
                            </OSWindow>
                        );
                    }

                    if (windowId === "settings") {
                        return (
                            <OSWindow
                                key="settings"
                                title="System Settings"
                                id="settings"
                                width="max-w-xl"
                                onClose={() => closeWindow("settings")}
                                onMinimize={() => toggleMinimize("settings")}
                                isActive={isActive}
                                onClick={() => focusWindow("settings")}
                                zIndex={zIndex}
                                initialX={150}
                                initialY={150}
                                isDarkMode={isDarkMode}
                            >
                                <div className="space-y-6">

                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-900'}`}>
                                                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</div>
                                                <div className="text-xs text-zinc-500">Adjust the window appearance</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-blue-500' : 'bg-zinc-300'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {/* Wallpaper Picker */}
                                    <div>
                                        <div className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Wallpaper</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { name: "Mojave", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2070" },
                                                { name: "Monterey", url: "https://512pixels.net/wp-content/uploads/2025/06/12-Dark-thumbnail.jpg" },
                                                { name: "Ventura", url: "https://512pixels.net/wp-content/uploads/2025/06/13-Ventura-Dark-thumb.jpg" },
                                                { name: "Big Sur", url: "https://512pixels.net/wp-content/uploads/2025/06/11-0-Color-Day-thumbnails.jpg" }
                                            ].map((wp) => (
                                                <div
                                                    key={wp.name}
                                                    onClick={() => setWallpaper(wp.url)}
                                                    className={`relative cursor-pointer group rounded-lg overflow-hidden border-2 transition-all ${wallpaper === wp.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:scale-[1.02]'}`}
                                                >
                                                    <img src={wp.url} className="w-full h-24 object-cover" />
                                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] p-1 text-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {wp.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </OSWindow>
                        );
                    }

                    return null;
                })}
            </AnimatePresence>

            {/* --- Dock --- */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl border border-white/20 px-2 py-2 rounded-2xl flex items-end gap-2 shadow-2xl z-50">
                <DockIcon icon={<User className="text-white fill-blue-500" />} onClick={() => openApp("about")} isOpen={openWindows.includes("about") && !minimizedWindows.includes("about")} />
                <DockIcon icon={<Folder className="text-white fill-blue-500" />} onClick={() => openApp("projects")} isOpen={openWindows.includes("projects") && !minimizedWindows.includes("projects")} />
                <DockIcon icon={<Briefcase className="text-white fill-blue-500" />} onClick={() => openApp("experience")} isOpen={openWindows.includes("experience") && !minimizedWindows.includes("experience")} />
                <DockIcon icon={<Settings className="text-zinc-300 fill-zinc-600" />} onClick={() => openApp("settings")} isOpen={openWindows.includes("settings") && !minimizedWindows.includes("settings")} />
                <div className="w-px h-8 bg-white/20 mx-1"></div>
                {profile.customDomain && (
                    <a href={`https://${profile.customDomain}`} target="_blank">
                        <DockIcon icon={<Globe className="text-white fill-blue-500" />} onClick={() => { }} isOpen={false} />
                    </a>
                )}
            </div>

        </div>
    );
}

// --- Sub Components ---

function OSWindow({ children, title, id, width = "max-w-2xl", onClose, onMinimize, isActive, onClick, zIndex, initialX = 0, initialY = 0, isDarkMode = false }: any) {
    return (
        <motion.div
            drag
            dragMomentum={false}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.1 } }}
            style={{
                zIndex: zIndex,
                x: initialX, // default position offset so windows don't stack directly on top
                y: initialY
            }}
            className={`fixed top-20 left-4 md:left-20 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden border ${width} w-[90vw] sm:w-full ${isActive ? 'ring-1 ring-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.3)]' : 'opacity-90 shadow-xl'} ${isDarkMode ? 'bg-zinc-900/85 border-zinc-700/50' : 'bg-white/85 border-white/40'}`}
            onPointerDown={onClick} // focus on click
        >
            {/* Title Bar */}
            <div className={`px-4 py-3 flex items-center justify-between border-b handle cursor-grab active:cursor-grabbing ${isDarkMode ? 'bg-zinc-800/50 border-zinc-700/30' : 'bg-zinc-200/50 border-zinc-300/30'}`} onPointerDown={(e) => { onClick(); }}>
                <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-[#FF5F56] hover:bg-[#FF5F56]/80 border border-[#E0443E] shadow-inner flex items-center justify-center group"><X className="w-2 h-2 opacity-0 group-hover:opacity-60 text-black/50" /></button>
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 border border-[#DEA123] shadow-inner flex items-center justify-center group"><Minus className="w-2 h-2 opacity-0 group-hover:opacity-60 text-black/50" /></button>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] shadow-inner"></div>
                </div>
                <span className={`text-xs font-semibold drop-shadow-sm pointer-events-none ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600/80'}`}>{title}</span>
                <div className="w-10"></div>
            </div>
            {/* Content */}
            <div className={`p-6 max-h-[70vh] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-zinc-900/50 text-zinc-300' : 'bg-white/50'}`}>
                {children}
            </div>
        </motion.div>
    );
}

function DesktopIcon({ label, icon, onClick }: any) {
    return (
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} onDoubleClick={onClick} className="group flex flex-col items-center gap-1 w-20 cursor-pointer text-shadow-sm select-none">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg group-hover:bg-white/20 hover:border-white/30 transition-all duration-200">
                <div className="w-9 h-9 text-white drop-shadow-md [&>svg]:w-full [&>svg]:h-full">
                    {React.cloneElement(icon as any, { className: "w-full h-full stroke-[1.5] drop-shadow-md text-blue-100" })}
                </div>
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm group-hover:bg-blue-600/80 transition-colors">
                {label}
            </span>
        </button>
    )
}

function DockIcon({ icon, onClick, isOpen }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.2, y: -10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="pb-2 relative group"
        >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner group-hover:bg-white/40 transition-colors">
                {React.cloneElement(icon as any, { className: "w-7 h-7 drop-shadow-sm" })}
            </div>
            {isOpen && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full shadow-[0_0_5px_white]"></div>}
        </motion.button>
    )
}
