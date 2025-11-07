import { prisma } from "../../../../lib/prisma";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params:  Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params; // 👈 unwrap the Promise

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) return notFound();


  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="mb-4 text-sm text-gray-500">
        ⭐ {project.stars} | 🍴 {project.forks}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
        {Array.isArray(project.tech) ? (
          <ul className="flex flex-wrap gap-2">
            {project.tech.map((t: string, i: number) => (
              <li key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {t}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tech stack listed.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Highlights</h2>
        {Array.isArray(project.highlights) ? (
          <ul className="list-disc list-inside space-y-1">
            {project.highlights.map((h: string, i: number) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : (
          <p>No highlights available.</p>
        )}
      </div>

      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        View on GitHub →
      </a>
    </main>
  );
}