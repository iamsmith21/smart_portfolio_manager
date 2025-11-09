// the page after we fill in the form and linkedin

"use client";

import { useState } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { templates } from "@/lib/templates";
import GridPreview from "@/components/previews/GridPreview";
import TimelinePreview from "@/components/previews/TimelinePreview";
import SpotlightPreview from "@/components/previews/SpotlightPreview";

const formSchema = z.object({
  github: z.string().min(1, "GitHub username is required"),
  linkedin: z.string().url("Must be a valid LinkedIn URL"),
});

export default function CreatePortfolioPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ github: "", linkedin: "" });
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("grid");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError(null);

    if (!session) {
      setError("You must sign in with GitHub first.");
      return;
    }

    try {
      const res = await fetch("/api/github/repos");
      if (!res.ok) {
        throw new Error("Failed to fetch GitHub repos");
      }
      const data = await res.json();
      // setRepos(data);
      // now we will call the AI summary response from gemini
      const summarizedRepos = await Promise.all(
      data.map(async (repo: any) => {
        const res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: repo.name,
            description: repo.description,
            stargazerCount: repo.stargazers_count,
            forkCount: repo.forks_count,
            url: repo.html_url,
          }),
        });

        const summary = await res.json();
        return {
          ...repo,
          summary, // includes name, description, tech, highlights
        };
      })
      );

      setRepos(summarizedRepos);

    } catch (err) {
      setError("Failed to fetch GitHub repos");
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate Your Portfolio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">GitHub Username</label>
          <input
            type="text"
            value={formData.github}
            onChange={(e) =>
              setFormData({ ...formData, github: e.target.value })
            }
            className="w-full border rounded p-2"
            placeholder="e.g. octocat"
          />
        </div>
        <div>
          <label className="block mb-1">LinkedIn URL</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) =>
              setFormData({ ...formData, linkedin: e.target.value })
            }
            className="w-full border rounded p-2"
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`border rounded p-4 ${
                  selectedTemplate === tpl.id ? "border-blue-600" : "border-gray-300"
                }`}
              >
                <h3 className="font-bold">{tpl.name}</h3>
                <p className="text-sm text-gray-600">{tpl.description}</p>
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-2">Live Preview</h2>
          <div className="border rounded p-4">
            {selectedTemplate === "grid" && <GridPreview repos={repos} />}
            {selectedTemplate === "timeline" && <TimelinePreview repos={repos} />}
            {selectedTemplate === "spotlight" && <SpotlightPreview repos={repos} />}
          </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </form>

      {/* Repo Grid */}
      {repos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {repos.map((repo) => (
              <div key={repo.id} className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-900">
                <h2 className="font-bold text-lg">{repo.name}</h2>

                {/* AI-generated summary description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {repo.summary?.description || "No summary available."}
                </p>

                {/* Highlights list */}
                {repo.summary?.highlights?.length > 0 && (
                  <ul className="text-xs mt-2 list-disc pl-4">
                    {repo.summary.highlights.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}

                {/* Tech stack */}
                {repo.summary?.tech?.length > 0 && (
                  <p className="text-xs mt-2 italic text-gray-500">
                    Tech: {repo.summary.tech.join(", ")}
                  </p>
                )}

                {/* GitHub link and metadata */}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  View on GitHub →
                </a>
                <p className="text-xs mt-2">
                  ⭐ {repo.stargazers_count} | {repo.language || "N/A"}
                </p>
              </div>
            ))}

            <button
              onClick={async () => {
                const res = await fetch("/api/portfolio/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    github: formData.github,
                    linkedin: formData.linkedin,
                    template: selectedTemplate,
                    repos,
                  }),
                });

                const data = await res.json();
                if (data.profileId) {
                  alert(`Portfolio saved! Profile ID: ${data.profileId}`);
                } else {
                  alert("Failed to save portfolio.");
                }
              }}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Portfolio
            </button>
        </div>

        
      )}
    </main>
  );
}