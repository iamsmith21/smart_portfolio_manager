"use client";

export default function GridPreview({ repos }: { repos: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {repos.map((repo) => (
        <div key={repo.id} className="border rounded p-4">
          <h2 className="font-bold">{repo.name}</h2>
          <p>{repo.summary?.description}</p>
        </div>
      ))}
    </div>
  );
}