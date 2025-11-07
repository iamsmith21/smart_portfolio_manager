import Link from "next/link";
import { prisma } from "lib/prisma";
import { CardContainer, CardBody, CardItem } from "@/components/ui/shadcn-io/3d-card";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0.1 gap-y-0.1">
        {projects.map((project) => (
          <CardContainer key={project.id} className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-6 border">
              
              {/* Title */}
              <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                {project.name}
              </CardItem>

              {/* Description */}
              <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300 line-clamp-2">
                {project.description}
              </CardItem>

              {/* Thumbnail (optional: repo image or placeholder) */}
              <CardItem translateZ="100" className="w-full mt-4">
                <img
                  src={`https://opengraph.githubassets.com/1/${project.repoUrl}`} 
                  alt="thumbnail"
                  className="h-48 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
              </CardItem>

              {/* Footer actions */}
              <div className="flex justify-between items-center mt-6">
                <Link href={`/projects/${project.id}`} className="w-full">
                <CardItem
                    translateZ={20}
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                >
                    Details →
                </CardItem>
                </Link>

                <CardItem
                  translateZ={20}
                  as="a"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  GitHub
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </main>
  );
}