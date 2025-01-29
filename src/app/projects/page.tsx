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
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a1b26] text-emerald-400">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1a1b26]">
        <div className="text-orange-500 bg-orange-950/30 px-4 py-2 rounded-md border border-orange-800/50">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b26] text-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              My Projects
            </h1>
            <p className="text-gray-400 mt-2">Manage and track your development projects</p>
          </div>
          <button
            onClick={createProject}
            className="bg-emerald-500 hover:bg-emerald-400 text-gray-900 px-6 py-3 rounded-lg 
                     font-medium transition-all duration-200 transform hover:scale-105 
                     hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] active:scale-95"
          >
            + New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block rounded-xl bg-[#24273a] p-6 
                       transition-all duration-300 hover:shadow-[0_0_25px_rgba(52,211,153,0.1)]
                       border border-gray-800/50 hover:border-emerald-500/30
                       relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300">
                    {project.title}
                  </h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${project.status === 'active' 
                      ? 'bg-emerald-400/10 text-emerald-400' 
                      : 'bg-gray-700/50 text-gray-400'}`}>
                    {project.status}
                  </span>
                </div>
                {project.subtitle && (
                  <p className="text-gray-400 mb-2 font-medium">{project.subtitle}</p>
                )}
                {project.description && (
                  <p className="text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium
                               bg-[#1a1b26] text-cyan-400 border border-cyan-950"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/3 to-cyan-500/3 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 