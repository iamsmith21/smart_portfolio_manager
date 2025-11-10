import { prisma } from "@/lib/prisma";
import { Github, ExternalLink, Star, GitFork, Linkedin, Mail, Globe, MapPin } from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/profile/AnimatedSection";
import ProjectImage from "@/components/profile/ProjectImage";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  const profile = await prisma.profile.findFirst({
    where: {
      name: username
    },
  });

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Profile not found</h1>
          <p className="text-gray-600 dark:text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const allProjects = await prisma.project.findMany({
    where: { 
      profileId: profile.id,
    },
    orderBy: { stars: "desc" },
  });
  
  // Filter to only show visible projects (type assertion until Prisma client regenerated)
  const projects = allProjects.filter((p: any) => p.visible !== false);

  // Get contact info (type assertion until Prisma client regenerated)
  const profileWithExtras = profile as any;
  const contact = profileWithExtras.contact && typeof profileWithExtras.contact === 'object' ? profileWithExtras.contact : null;
  const linkedinUrl = contact?.linkedin || (profile.about?.startsWith("http") ? profile.about : null);
  const aboutText = profile.about?.startsWith("http") ? null : profile.about;

  // Get skills array
  const skills = Array.isArray(profile.skills) ? profile.skills.filter((s): s is string => typeof s === 'string') : [];
  
  // Get work experience and education (type assertion until Prisma client regenerated)
  const workExperience = Array.isArray(profileWithExtras.workExperience) ? profileWithExtras.workExperience : [];
  const education = Array.isArray(profileWithExtras.education) ? profileWithExtras.education : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      {/* Hero Section */}
      <AnimatedSection>
        <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <img
                src={`https://github.com/${profile.name}.png`}
                alt={`${profile.name}'s avatar`}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 font-medium">
                {profile.headline}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a
                  href={`https://github.com/${profile.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* About Section */}
      {aboutText && (
        <AnimatedSection>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {aboutText}
              </p>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <AnimatedSection delay={0.2}>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Skills & Technologies</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {skills.map((skill, index: number) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Work Experience Section */}
      {workExperience.length > 0 && (
        <AnimatedSection delay={0.3}>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Work Experience</h2>
            <div className="space-y-6">
              {workExperience.map((exp: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {exp.startDate && exp.endDate && ' - '}
                        {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                      </p>
                      {exp.current && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-3">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <AnimatedSection delay={0.35}>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Education</h2>
            <div className="space-y-6">
              {education.map((edu: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{edu.school}</p>
                      {edu.field && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{edu.field}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {edu.startDate && edu.endDate && ' - '}
                        {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-3">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>
      )}

       <AnimatedSection delay={0.5}>
        <section className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Projects</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <AnimatedCard key={project.id} index={index}>
                  <div
                    className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:-translate-y-2"
                  >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <ProjectImage repoUrl={project.repoUrl} projectName={project.name} />
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  {Array.isArray(project.highlights) && project.highlights.length > 0 && (
                    <ul className="mb-4 space-y-1">
                      {project.highlights.filter((h): h is string => typeof h === 'string').slice(0, 2).map((highlight, i: number) => (
                        <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack */}
                  {Array.isArray(project.tech) && project.tech.length > 0 && (() => {
                    const techStack = project.tech.filter((t): t is string => typeof t === 'string');
                    return (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {techStack.slice(0, 4).map((tech, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {techStack.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                            +{techStack.length - 4}
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{project.forks}</span>
                      </div>
                    </div>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View</span>
                    </a>
                  </div>
                </div>
                </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </section>
      </AnimatedSection>

      
      {/* Contact Section */}
      {contact && (contact.email || contact.website || contact.location) && (
        <AnimatedSection delay={0.4}>
          <section className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Contact</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span>{contact.location}</span>
                </div>
              )}
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Projects Section */}

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </main>
  );
}
