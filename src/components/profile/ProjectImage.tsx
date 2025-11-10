"use client";

import { useState } from "react";

interface ProjectImageProps {
  repoUrl: string;
  projectName: string;
}

export default function ProjectImage({ repoUrl, projectName }: ProjectImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center p-4">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{projectName}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={`https://opengraph.githubassets.com/1/${repoUrl}`}
      alt={projectName}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      onError={() => setImageError(true)}
    />
  );
}

