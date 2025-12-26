"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, Save, ExternalLink, Github, Loader2, X,
  User, Briefcase, GraduationCap, Code2, FolderGit2, Mail, LayoutDashboard, RefreshCw, CheckCircle, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Contact {
  email: string;
  linkedin: string;
  website: string;
  location: string;
  github: string;
  image: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  repoUrl?: string;
  tech?: string[];
  highlights?: string[];
}

interface ManualProject {
  name: string;
  description: string;
  url: string;
  tech: string[];
  highlights: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);



  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "education" | "skills" | "projects" | "contact">("profile");

  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [domainStatus, setDomainStatus] = useState<{ verified: boolean; error?: string } | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [contact, setContact] = useState<Contact>({
    email: "",
    linkedin: "",
    website: "",
    location: "",
    github: "",
    image: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [hasGitHubAccount, setHasGitHubAccount] = useState(false);

  const [importing, setImporting] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [availableRepos, setAvailableRepos] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  const [showManualProjectModal, setShowManualProjectModal] = useState(false);
  const [manualProject, setManualProject] = useState<ManualProject>({
    name: "",
    description: "",
    url: "",
    tech: [],
    highlights: [],
  });
  const [newTech, setNewTech] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [addingManualProject, setAddingManualProject] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated" || !session) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {

      try {
        const userRes = await fetch("/api/github/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          const username = userData.username;
          setGithubUsername(username);
          setHasGitHubAccount(userData.hasGitHubAccount || false);

          const profileRes = await fetch(`/api/profile/${username}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setHeadline(profileData.headline || "");
            setAbout(profileData.about || "");
            setCustomDomain(profileData.customDomain || "");
            setSavedDomain(profileData.customDomain || "");
            if (profileData.customDomain) {
              checkDomainStatus(profileData.customDomain);
            }
            setWorkExperience(
              Array.isArray(profileData.workExperience)
                ? profileData.workExperience
                : []
            );
            setEducation(
              Array.isArray(profileData.education) ? profileData.education : []
            );
            setSkills(
              Array.isArray(profileData.skills) ? profileData.skills : []
            );
            setContact(profileData.contact || {
              email: "",
              linkedin: "",
              website: "",
              location: "",
              github: "",
              image: "",
            });
            setProjects(profileData.projects || []);
          }
        } else {
          const userData = await userRes.json().catch(() => null);
          if (userData?.error) {
            setError("Failed to load user information. Please try again.");
          }
        }
      } catch (err) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session, status, router]);

  const addWorkExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false,
      },
    ]);
  };

  const removeWorkExperience = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string | boolean
  ) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperience(updated);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleProjectVisibility = (projectId: string) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, visible: !p.visible } : p
      )
    );
  };

  const handleLinkGitHub = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const callbackUrl = encodeURIComponent(`${origin}/settings`);
    window.location.href = `${origin}/api/auth/signin/github?callbackUrl=${callbackUrl}`;
  };

  const fetchGitHubRepos = async () => {
    if (!hasGitHubAccount) {
      handleLinkGitHub();
      return;
    }

    setFetchingRepos(true);
    setError(null);
    try {
      const res = await fetch("/api/github/repos?per_page=100");
      if (!res.ok) {
        if (res.status === 403) {
          setError("GitHub account not linked. Please link your GitHub account first.");
          return;
        }
        throw new Error("Failed to fetch repositories");
      }
      const repos = await res.json();
      setAvailableRepos(repos);
      setShowImportModal(true);
    } catch (err) {
      setError("Failed to fetch GitHub repositories. Please try again.");
    } finally {
      setFetchingRepos(false);
    }
  };

  const toggleRepoSelection = (repoUrl: string) => {
    setSelectedRepos((prev) =>
      prev.includes(repoUrl)
        ? prev.filter((url) => url !== repoUrl)
        : [...prev, repoUrl]
    );
  };

  const handleImportProjects = async () => {
    if (selectedRepos.length === 0) {
      setError("Please select at least one repository to import");
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const res = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrls: selectedRepos }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import projects");
      }

      if (githubUsername) {
        const profileRes = await fetch(`/api/profile/${githubUsername}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProjects(profileData.projects || []);
        }
      }

      setSuccess(true);
      setShowImportModal(false);
      setSelectedRepos([]);
      setAvailableRepos([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to import projects. Please try again."
      );
    } finally {
      setImporting(false);
    }
  };

  const handleAddManualProject = async () => {
    if (!manualProject.name || !manualProject.description) {
      setError("Name and description are required");
      return;
    }

    setAddingManualProject(true);
    setError(null);

    try {
      const res = await fetch("/api/projects/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualProject),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add project");
      }

      if (githubUsername) {
        const profileRes = await fetch(`/api/profile/${githubUsername}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProjects(profileData.projects || []);
        }
      }

      setSuccess(true);
      setShowManualProjectModal(false);
      setManualProject({
        name: "",
        description: "",
        url: "",
        tech: [],
        highlights: [],
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add project. Please try again."
      );
    } finally {
      setAddingManualProject(false);
    }
  };

  const handleSave = async () => {
    if (!githubUsername) {
      setError("Username not found. Please refresh the page.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: githubUsername,
          headline,
          about,
          customDomain,
          workExperience,
          education,
          skills,
          contact,
          projects: projects.map((p) => ({
            id: p.id,
            visible: p.visible,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setSavedDomain(customDomain);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to save settings");
      }
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const checkDomainStatus = async (domain: string) => {
    setCheckingDomain(true);
    try {
      const res = await fetch(`/api/domain/verify?domain=${domain}`);
      const data = await res.json();

      if (data.verified) {
        setDomainStatus({ verified: true });
      } else {
        setDomainStatus({ verified: false, error: data.error || "Not configured" });
      }
    } catch (err) {
      setDomainStatus({ verified: false, error: "Failed to check status" });
    } finally {
      setCheckingDomain(false);
    }
  };

  // --- Render Helpers ---

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "contact", label: "Contact", icon: Mail },
  ] as const;

  if (loading || status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">Please sign in to access settings.</p>
          <button onClick={() => router.push("/")} className="text-primary hover:underline">
            Return to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 pt-24 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
            Command Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio presence and content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {githubUsername && (
            <a
              href={`/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-white/50 dark:bg-secondary/50 hover:bg-secondary/70 border border-zinc-200 dark:border-white/5 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start">

        {/* Sidebar Navigation */}
        <aside className="sticky top-32 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                  ? "bg-primary/10 text-primary font-medium shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)]"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 border border-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="min-h-[500px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Status Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2">
                  <X className="w-4 h-4" /> {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2">
                  <span className="flex-1">Settings saved successfully.</span>
                </div>
              )}

              {/* --- TAB CONTENT: PROFILE --- */}
              {activeTab === "profile" && (
                <section className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-white/5 backdrop-blur-sm space-y-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" /> Profile Details
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Headline</label>
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="e.g. Senior Full Stack Engineer"
                          className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">About / Bio</label>
                        <textarea
                          value={about}
                          onChange={(e) => setAbout(e.target.value)}
                          placeholder="Tell your story..."
                          rows={6}
                          className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Custom Domain</label>

                        {savedDomain ? (
                          <div className={`flex flex-col gap-2 p-3 rounded-lg border ${domainStatus?.verified
                            ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/50"
                            : "border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/50"
                            }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-medium">
                                <div className={`w-2 h-2 rounded-full ${domainStatus?.verified ? "bg-green-500" : "bg-amber-500 animate-pulse"}`} />
                                <a
                                  href={`http://${savedDomain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline ${domainStatus?.verified ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"}`}
                                >
                                  {savedDomain}
                                </a>
                                {domainStatus?.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => checkDomainStatus(savedDomain)}
                                  disabled={checkingDomain}
                                  className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-full text-muted-foreground transition-colors"
                                  title="Refresh Status"
                                >
                                  <RefreshCw className={`w-4 h-4 ${checkingDomain ? "animate-spin" : ""}`} />
                                </button>
                                <button
                                  onClick={() => {
                                    setCustomDomain("");
                                    setSavedDomain(""); // Unlocks the field
                                    setDomainStatus(null);
                                  }}
                                  className="p-2 hover:bg-white/50 dark:hover:bg-black/20 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                                  title="Remove Domain"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {!domainStatus?.verified && (
                              <div className="text-xs text-amber-700 dark:text-amber-400 mt-1 pl-4">
                                {checkingDomain ? "Checking configuration..." : "Pending configuration. Ensure your DNS records are correct."}
                                <div className="mt-1 font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
                                  A Record: <b>76.76.21.21</b>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">https://</span>
                              <input
                                type="text"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="your-domain.com"
                                className="flex-1 bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/30"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Point your domain's <b>A Record</b> to <code>76.76.21.21</code> (Vercel) or your server IP.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* --- TAB CONTENT: EXPERIENCE --- */}
              {activeTab === "experience" && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Work History</h2>
                    <button onClick={addWorkExperience} className="text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 hover:bg-zinc-100 dark:hover:bg-secondary border border-zinc-200 dark:border-white/5 transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Role
                    </button>
                  </div>

                  <div className="space-y-4">
                    {workExperience.map((exp, index) => (
                      <div key={index} className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-white/5 backdrop-blur-sm relative group transition-all hover:shadow-sm dark:hover:bg-secondary/30">
                        <button
                          onClick={() => removeWorkExperience(index)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(index, "company", e.target.value)}
                            className="bg-transparent border-b border-zinc-200 dark:border-white/10 py-2 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                          <input
                            placeholder="Role / Title"
                            value={exp.role}
                            onChange={(e) => updateWorkExperience(index, "role", e.target.value)}
                            className="bg-transparent border-b border-zinc-200 dark:border-white/10 py-2 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div className="flex gap-4 mb-4">
                          <input type="month" value={exp.startDate} onChange={(e) => updateWorkExperience(index, "startDate", e.target.value)} className="bg-white dark:bg-background/20 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-sm text-muted-foreground" />
                          <span className="text-muted-foreground self-center">to</span>
                          <input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateWorkExperience(index, "endDate", e.target.value)}
                            disabled={exp.current}
                            className="bg-white dark:bg-background/20 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-sm text-muted-foreground disabled:opacity-30"
                          />
                          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
                            <input type="checkbox" checked={exp.current} onChange={(e) => updateWorkExperience(index, "current", e.target.checked)} className="rounded border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5" />
                            Current
                          </label>
                        </div>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateWorkExperience(index, "description", e.target.value)}
                          placeholder="Key achievements..."
                          rows={3}
                          className="w-full bg-white dark:bg-background/30 border border-zinc-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                        />
                      </div>
                    ))}
                    {workExperience.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl">
                        <Briefcase className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">No experience listed.</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* --- TAB CONTENT: EDUCATION --- */}
              {activeTab === "education" && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Education</h2>
                    <button onClick={addEducation} className="text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-secondary/50 hover:bg-zinc-100 dark:hover:bg-secondary border border-zinc-200 dark:border-white/5 transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  </div>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-white/5 backdrop-blur-sm relative group">
                        <button
                          onClick={() => removeEducation(index)}
                          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input
                            placeholder="School / University"
                            value={edu.school}
                            onChange={(e) => updateEducation(index, "school", e.target.value)}
                            className="bg-transparent border-b border-zinc-200 dark:border-white/10 py-2 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                          <input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            className="bg-transparent border-b border-zinc-200 dark:border-white/10 py-2 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div className="mb-4">
                          <input
                            placeholder="Field of Study"
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-200 dark:border-white/10 py-2 focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                          />
                        </div>
                        <div className="flex gap-4 mb-4">
                          <input type="month" value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} className="bg-white dark:bg-background/20 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-sm text-muted-foreground" />
                          <span className="text-muted-foreground self-center">to</span>
                          <input type="month" value={edu.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} className="bg-white dark:bg-background/20 border border-zinc-200 dark:border-white/10 rounded px-2 py-1 text-sm text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* --- TAB CONTENT: SKILLS --- */}
              {activeTab === "skills" && (
                <section className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-4">Tech Stack & Skills</h2>
                    <div className="flex gap-2 mb-6">
                      <input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addSkill()}
                        placeholder="Add a skill e.g. React, Node.js..."
                        className="flex-1 bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-primary/50 outline-none"
                      />
                      <button onClick={addSkill} className="px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm flex items-center gap-2 group hover:border-primary/50 transition-colors cursor-default">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      {skills.length === 0 && <p className="text-muted-foreground text-sm italic">No skills added yet.</p>}
                    </div>
                  </div>
                </section>
              )}

              {/* --- TAB CONTENT: PROJECTS --- */}
              {activeTab === "projects" && (
                <section className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Featured Projects</h2>
                    <div className="flex gap-2">
                      <button onClick={() => setShowManualProjectModal(true)} className="px-3 py-2 rounded-lg bg-white dark:bg-secondary/50 hover:bg-zinc-100 dark:hover:bg-secondary border border-zinc-200 dark:border-white/5 text-sm transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Manual
                      </button>
                      {hasGitHubAccount ? (
                        <button onClick={fetchGitHubRepos} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors flex items-center gap-2">
                          <Github className="w-4 h-4" /> Import from GitHub
                        </button>
                      ) : (
                        <button onClick={handleLinkGitHub} className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm transition-colors flex items-center gap-2">
                          <Github className="w-4 h-4" /> Link GitHub
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {projects.map(project => (
                      <div key={project.id} className="p-4 rounded-xl bg-white dark:bg-secondary/10 border border-zinc-200 dark:border-white/5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-secondary/20 transition-colors">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <input
                              type="checkbox"
                              checked={project.visible}
                              onChange={() => toggleProjectVisibility(project.id)}
                              className="rounded border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5"
                            />
                            Show on Profile
                          </label>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-white/5 rounded-2xl">
                        <FolderGit2 className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">No projects yet.</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* --- TAB CONTENT: CONTACT --- */}
              {activeTab === "contact" && (
                <section className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white dark:bg-secondary/20 border border-zinc-200 dark:border-white/5 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                        <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">LinkedIn</label>
                        <input type="url" value={contact.linkedin} onChange={(e) => setContact({ ...contact, linkedin: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Website / Portfolio</label>
                        <input type="url" value={contact.website} onChange={(e) => setContact({ ...contact, website: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Location</label>
                        <input type="text" value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub URL</label>
                        <input type="url" value={contact.github} onChange={(e) => setContact({ ...contact, github: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Avatar URL (Optional)</label>
                        <input type="url" value={contact.image} onChange={(e) => setContact({ ...contact, image: e.target.value })} className="w-full bg-white dark:bg-background/50 border border-zinc-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modals remain mostly the same structure but styled if needed, or we just keep them at the bottom */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col relative">
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Import Projects</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            {/* List Logic Reuse */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {/* ... Existing Loop logic adapted for dark mode default ... */}
              {availableRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => toggleRepoSelection(repo.html_url)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${selectedRepos.includes(repo.html_url)
                    ? "bg-primary/10 border-primary"
                    : "bg-white dark:bg-secondary/10 border-zinc-200 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-secondary/20"
                    }`}
                >
                  <input type="checkbox" checked={selectedRepos.includes(repo.html_url)} readOnly className="mt-1" />
                  <div>
                    <h3 className="font-semibold">{repo.name}</h3>
                    <p className="text-sm text-muted-foreground">{repo.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/10 bg-secondary/10 flex justify-end gap-3">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">Cancel</button>
              <button onClick={handleImportProjects} disabled={importing || selectedRepos.length === 0} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
                {importing ? "Importing..." : `Import ${selectedRepos.length} Projects`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualProjectModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-background border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col">
            <div className="p-6 border-b border-zinc-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold">Add Manual Project</h2>
              <button onClick={() => setShowManualProjectModal(false)} className="p-2 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Inputs reused logic */}
              <input
                value={manualProject.name}
                onChange={e => setManualProject({ ...manualProject, name: e.target.value })}
                placeholder="Project Name"
                className="w-full bg-secondary/10 border border-white/10 rounded-lg p-3 outline-none focus:border-primary"
              />
              <textarea
                value={manualProject.description}
                onChange={e => setManualProject({ ...manualProject, description: e.target.value })}
                placeholder="Description"
                rows={4}
                className="w-full bg-secondary/10 border border-white/10 rounded-lg p-3 outline-none focus:border-primary"
              />
              <input
                value={manualProject.url}
                onChange={e => setManualProject({ ...manualProject, url: e.target.value })}
                placeholder="Project URL"
                className="w-full bg-secondary/10 border border-white/10 rounded-lg p-3 outline-none focus:border-primary"
              />
              {/* Tech/Highlights simplified for this edit to match visually */}
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowManualProjectModal(false)} className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5">Cancel</button>
              <button onClick={handleAddManualProject} disabled={addingManualProject} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50">
                {addingManualProject ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

