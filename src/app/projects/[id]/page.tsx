'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

interface Tag {
  id: string;
  name: string;
}

interface Section {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Resource {
  id: string;
  type: string;
  title: string;
  url: string;
}

interface Activity {
  id: string;
  type: string;
  content: string;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  status: string;
  tags: Tag[];
  sections: Section[];
  resources: Resource[];
  activities: Activity[];
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { currentTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProject();
    }
  }, [session, params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      const data = await response.json();
      setProject(data);
      setEditedProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProject),
      });

      if (!response.ok) throw new Error("Failed to update project");
      const updatedProject = await response.json();
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");
      router.push("/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" 
           style={{ backgroundColor: currentTheme.colors.background }}>
        <div className="animate-pulse" style={{ color: currentTheme.colors.primary }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen" 
           style={{ backgroundColor: currentTheme.colors.background }}>
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

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen" 
           style={{ backgroundColor: currentTheme.colors.background }}>
        <div style={{ color: currentTheme.colors.text.primary }}>Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: currentTheme.colors.background }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: currentTheme.colors.primary }}
          >
            <span>←</span>
            <span>Back to Projects</span>
          </Link>
        </div>

        <div className="rounded-xl p-6" style={{ 
          backgroundColor: currentTheme.colors.cardBackground,
          boxShadow: `0 0 0 1px ${currentTheme.colors.border.default}`,
        }}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProject.title || ""}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, title: e.target.value })
                  }
                  className="w-full mb-2 p-2 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text.primary,
                    border: `1px solid ${currentTheme.colors.border.default}`,
                  }}
                />
              ) : (
                <h1 className="text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
                  {project.title}
                </h1>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={editedProject.subtitle || ""}
                  onChange={(e) =>
                    setEditedProject({ ...editedProject, subtitle: e.target.value })
                  }
                  className="w-full p-2 rounded-lg"
                  style={{
                    backgroundColor: currentTheme.colors.background,
                    color: currentTheme.colors.text.secondary,
                    border: `1px solid ${currentTheme.colors.border.default}`,
                  }}
                />
              ) : (
                project.subtitle && (
                  <p style={{ color: currentTheme.colors.text.secondary }} className="text-xl">
                    {project.subtitle}
                  </p>
                )
              )}
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.background,
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: currentTheme.colors.cardBackground,
                      color: currentTheme.colors.text.primary,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/projects/${params.id}/edit`}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.background,
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                    style={{
                      backgroundColor: currentTheme.colors.status.inactive.background,
                      color: currentTheme.colors.status.inactive.text,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            {isEditing ? (
              <textarea
                value={editedProject.description || ""}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, description: e.target.value })
                }
                className="w-full h-32 p-2 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  color: currentTheme.colors.text.primary,
                  border: `1px solid ${currentTheme.colors.border.default}`,
                }}
              />
            ) : (
              project.description && (
                <p style={{ color: currentTheme.colors.text.primary }}>
                  {project.description}
                </p>
              )
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.primary }}>
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
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

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.primary }}>
              Sections
            </h2>
            {project.sections.map((section) => (
              <div 
                key={section.id} 
                className="mb-4 p-4 rounded-lg"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  border: `1px solid ${currentTheme.colors.border.default}`,
                }}
              >
                <h3 className="font-semibold" style={{ color: currentTheme.colors.text.primary }}>
                  {section.title}
                </h3>
                <p style={{ color: currentTheme.colors.text.secondary }}>
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.primary }}>
              Resources
            </h2>
            {project.resources.map((resource) => (
              <div key={resource.id} className="mb-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {resource.title} ({resource.type})
                </a>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: currentTheme.colors.primary }}>
              Activity
            </h2>
            {project.activities.map((activity) => (
              <div key={activity.id} className="mb-2 text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                {new Date(activity.createdAt).toLocaleString()}: {activity.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 