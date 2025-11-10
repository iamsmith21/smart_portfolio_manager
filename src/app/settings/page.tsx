"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, ExternalLink, Github, Loader2, X } from "lucide-react";

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
}

interface Project {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Profile data
  const [headline, setHeadline] = useState("");
  const [about, setAbout] = useState("");
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [contact, setContact] = useState<Contact>({
    email: "",
    linkedin: "",
    website: "",
    location: "",
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  
  // Import projects state
  const [importing, setImporting] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [availableRepos, setAvailableRepos] = useState<any[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    // Wait for session to finish loading
    if (status === "loading") {
      return;
    }

    // If not authenticated after loading, redirect
    if (status === "unauthenticated" || !session) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {

      try {
        // Get GitHub username
        const userRes = await fetch("/api/github/user");
        if (userRes.ok) {
          const userData = await userRes.json();
          setGithubUsername(userData.username);

          // Fetch profile data
          const profileRes = await fetch(`/api/profile/${userData.username}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setHeadline(profileData.headline || "");
            setAbout(profileData.about || "");
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
            });
            setProjects(profileData.projects || []);
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

  const fetchGitHubRepos = async () => {
    setFetchingRepos(true);
    setError(null);
    try {
      const res = await fetch("/api/github/repos?per_page=100");
      if (!res.ok) {
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

      // Refresh projects list
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

  const handleSave = async () => {
    if (!githubUsername) {
      setError("GitHub username not found");
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

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (status === "loading" || loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">Please sign in to access settings.</p>
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Portfolio Settings</h1>
        <div className="flex items-center gap-3">
          {githubUsername && (
            <a
              href={`/profile/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View Portfolio
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={5}
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
          </div>
        </section>

        {/* Work Experience Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Work Experience</h2>
            <button
              onClick={addWorkExperience}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>
          <div className="space-y-4">
            {workExperience.map((exp, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">Experience #{index + 1}</h3>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateWorkExperience(index, "company", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) =>
                        updateWorkExperience(index, "role", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Start Date</label>
                    <input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "startDate", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">End Date</label>
                    <input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                      className="w-full border rounded p-2 dark:bg-gray-700 disabled:opacity-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateWorkExperience(index, "current", e.target.checked)
                      }
                    />
                    <span className="text-sm">Currently working here</span>
                  </label>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateWorkExperience(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="w-full border rounded p-2 dark:bg-gray-700"
                  />
                </div>
              </div>
            ))}
            {workExperience.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No work experience added yet. Click "Add Experience" to get
                started.
              </p>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Education</h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">Education #{index + 1}</h3>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(index, "school", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(index, "field", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Start Date</label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(index, "startDate", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">End Date</label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(index, "endDate", e.target.value)
                      }
                      className="w-full border rounded p-2 dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full border rounded p-2 dark:bg-gray-700"
                  />
                </div>
              </div>
            ))}
            {education.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No education added yet. Click "Add Education" to get started.
              </p>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            <button
              onClick={fetchGitHubRepos}
              disabled={fetchingRepos || importing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {fetchingRepos ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  <span>Import from GitHub</span>
                </>
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select which GitHub projects to display on your portfolio
          </p>
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={project.visible}
                    onChange={() => toggleProjectVisibility(project.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Show</span>
                </label>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8">
                <Github className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">
                  No projects found. Import your GitHub repositories to get started.
                </p>
                <button
                  onClick={fetchGitHubRepos}
                  disabled={fetchingRepos || importing}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {fetchingRepos ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Import from GitHub"
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill"
              className="flex-1 border rounded-lg p-2 dark:bg-gray-800"
            />
            <button
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">LinkedIn</label>
              <input
                type="url"
                value={contact.linkedin}
                onChange={(e) =>
                  setContact({ ...contact, linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourname"
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Website</label>
              <input
                type="url"
                value={contact.website}
                onChange={(e) =>
                  setContact({ ...contact, website: e.target.value })
                }
                placeholder="https://yourwebsite.com"
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                value={contact.location}
                onChange={(e) =>
                  setContact({ ...contact, location: e.target.value })
                }
                placeholder="City, Country"
                className="w-full border rounded-lg p-3 dark:bg-gray-800"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Import Projects Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Import Projects from GitHub
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select repositories to import and add to your portfolio
                </p>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setSelectedRepos([]);
                  setAvailableRepos([]);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {availableRepos.length === 0 ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading repositories...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRepos.includes(repo.html_url)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                      }`}
                      onClick={() => toggleRepoSelection(repo.html_url)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedRepos.includes(repo.html_url)}
                          onChange={() => toggleRepoSelection(repo.html_url)}
                          className="mt-1 w-4 h-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {repo.name}
                            </h3>
                            {repo.private && (
                              <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                Private
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {repo.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            {repo.language && (
                              <span>{repo.language}</span>
                            )}
                            <span>⭐ {repo.stargazers_count || 0}</span>
                            <span>🍴 {repo.forks_count || 0}</span>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              View on GitHub
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRepos.length > 0
                  ? `${selectedRepos.length} repository${
                      selectedRepos.length > 1 ? "ies" : "y"
                    } selected`
                  : "No repositories selected"}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setSelectedRepos([]);
                    setAvailableRepos([]);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={importing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportProjects}
                  disabled={selectedRepos.length === 0 || importing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Import Selected</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

