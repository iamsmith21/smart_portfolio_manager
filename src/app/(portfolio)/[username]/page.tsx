import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/profile/Hero";
import { TechStack } from "@/components/profile/TechStack";
import { About } from "@/components/profile/About";
import { Experience } from "@/components/profile/Experience";
import { ProjectGrid } from "@/components/profile/ProjectGrid";
import { ContactFooter } from "@/components/profile/ContactFooter";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // 1. Fetch Profile
  const profile = await prisma.profile.findFirst({
    where: { name: username },
    include: {
      user: {
        include: {
          accounts: { where: { provider: "github" } }
        }
      }
    },
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-zinc-900 dark:text-white">
        <p className="text-zinc-500">Profile not found</p>
      </div>
    );
  }

  const profileWithExtras = profile as any;
  const contact = profileWithExtras.contact || {};

  // 2. Prepare Data
  const heroProfile = {
    name: profile.name,
    headline: profile.headline || "",
    image: contact.image,
  };

  const socials = {
    github: contact.github,
    linkedin: contact.linkedin,
  };

  const skills = Array.isArray(profile.skills) ? profile.skills.filter((s): s is string => typeof s === 'string') : [];
  const workExperience = (Array.isArray(profile.workExperience) ? profile.workExperience : []) as any[];
  const education = (Array.isArray(profile.education) ? profile.education : []) as any[];

  const allProjects = await prisma.project.findMany({
    where: { profileId: profile.id },
    orderBy: { stars: "desc" },
  });

  const projects = allProjects
    .filter((p: any) => p.visible !== false)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      repoUrl: p.repoUrl || "",
      stars: p.stars || 0,
      forks: p.forks || 0,
      tech: Array.isArray(p.tech) ? p.tech : [],
      highlights: Array.isArray(p.highlights) ? p.highlights : [],
      featured: p.featured || false,
    }));

  return (
    <main className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-100 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white">
      <Hero profile={heroProfile} socials={socials} />
      <About about={profile.about} />
      <Experience work={workExperience} education={education} />
      <TechStack skills={skills} />
      <ProjectGrid projects={projects} />
      <ContactFooter contact={{
        email: contact.email,
        website: contact.website,
        location: contact.location
      }} />
    </main>
  );
}
