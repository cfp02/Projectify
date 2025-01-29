'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: string;
  tags: { id: string; name: string; }[];
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Project",
          subtitle: "Project subtitle",
          description: "Project description",
          status: "active",
          tags: ["new"],
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");
      const newProject = await response.json();
      router.push(`/projects/${newProject.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <button
          onClick={createProject}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block border rounded-lg p-6 hover:shadow-lg transition-all hover:border-indigo-300 cursor-pointer"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">{project.title}</h2>
              {project.subtitle && (
                <p className="text-gray-600 mb-2">{project.subtitle}</p>
              )}
              {project.description && (
                <p className="text-gray-500 mb-4 line-clamp-2">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Status: <span className="capitalize">{project.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 