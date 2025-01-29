'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeSelector } from "@/components/ThemeSelector";

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: string;
  tags: { id: string; name: string; }[];
}

export default function ProjectsPage() {
  const { currentTheme } = useTheme();
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
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="animate-pulse" style={{ color: currentTheme.colors.primary }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="px-4 py-2 rounded-md border" style={{
          color: currentTheme.colors.status.inactive.text,
          backgroundColor: currentTheme.colors.status.inactive.background,
          borderColor: currentTheme.colors.border.default,
        }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ color: currentTheme.colors.primary }}>
              My Projects
            </h1>
            <p style={{ color: currentTheme.colors.text.secondary }}>
              Manage and track your development projects
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSelector />
            <Link
              href="/projects/new"
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.background,
                boxShadow: currentTheme.shadows.button.replace(/_/g, ' '),
              }}
            >
              + New Project
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block rounded-xl p-6 transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: currentTheme.colors.cardBackground,
                borderColor: currentTheme.colors.border.default,
                boxShadow: `0 0 0 1px ${currentTheme.colors.border.default}`,
              }}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold" style={{ color: currentTheme.colors.primary }}>
                    {project.title}
                  </h2>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                    color: project.status === 'active' 
                      ? currentTheme.colors.status.active.text 
                      : currentTheme.colors.status.inactive.text,
                    backgroundColor: project.status === 'active'
                      ? currentTheme.colors.status.active.background
                      : currentTheme.colors.status.inactive.background,
                  }}>
                    {project.status}
                  </span>
                </div>
                {project.subtitle && (
                  <p style={{ color: currentTheme.colors.text.secondary }} className="mb-2 font-medium">
                    {project.subtitle}
                  </p>
                )}
                {project.description && (
                  <p style={{ color: currentTheme.colors.text.muted }} className="mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: currentTheme.colors.tag.background,
                        color: currentTheme.colors.tag.text,
                        boxShadow: `0 0 0 1px ${currentTheme.colors.tag.border}`,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to right, ${currentTheme.colors.primary}05, ${currentTheme.colors.secondary}05)`,
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 