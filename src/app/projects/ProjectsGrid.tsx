// src/app/projects/ProjectsGrid.tsx (Client Component)
"use client";

import { CardContainer, CardBody, CardItem } from "@/components/ui/shadcn-io/3d-card";
import Link from "next/link";

export default function ProjectsGrid({ projects }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <CardContainer key={project.id}>
          <CardBody className="rounded-xl p-4 border">
            <CardItem translateZ="50" className="text-xl font-bold">
              {project.name}
            </CardItem>
            <CardItem as="p" translateZ="60" className="text-sm mt-2">
              {project.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <img src="https://opengraph.githubassets.com/1/${project.repoUrl}" alt="thumbnail" className="rounded-xl" />
            </CardItem>
            <div className="flex justify-between mt-6">
              <CardItem as={Link} href={`/projects/${project.id}`} translateZ={20}>
                Details →
              </CardItem>
              <CardItem as="a" href={project.repoUrl} target="_blank" translateZ={20}>
                GitHub
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}