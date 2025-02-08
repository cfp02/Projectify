'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { ReadmeEditor } from "@/components/ReadmeEditor";
import GitHubRepoLink from "@/components/GitHubRepoLink";
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { SectionEditor } from '@/components/SectionEditor';

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

interface ProjectVersion {
  id: string;
  version: number;
  title: string;
  subtitle?: string;
  description?: string;
  status: string;
  createdAt: string;
  reason?: string;
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
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [creatingVersion, setCreatingVersion] = useState(false);
  const [versionReason, setVersionReason] = useState("");
  const [restoringVersion, setRestoringVersion] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchProject();
      fetchVersions();
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

  const fetchVersions = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}/versions`);
      if (!response.ok) throw new Error("Failed to fetch versions");
      const data = await response.json();
      setVersions(data);
    } catch (err) {
      console.error("Error fetching versions:", err);
    }
  };

  const createVersion = async () => {
    if (!versionReason.trim()) return;
    
    setCreatingVersion(true);
    try {
      const response = await fetch(`/api/projects/${params.id}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: versionReason }),
      });

      if (!response.ok) throw new Error("Failed to create version");
      
      const newVersion = await response.json();
      setVersions([newVersion, ...versions]);
      setVersionReason("");
      // Refresh project data to get updated activities
      fetchProject();
    } catch (err) {
      console.error("Error creating version:", err);
    } finally {
      setCreatingVersion(false);
    }
  };

  const restoreVersion = async (versionId: string) => {
    if (!confirm("Are you sure you want to restore this version? Current project state will be overwritten.")) {
      return;
    }

    setRestoringVersion(true);
    try {
      const response = await fetch(`/api/projects/${params.id}/versions/restore/${versionId}`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Failed to restore version");
      
      // Refresh project data and versions
      await Promise.all([fetchProject(), fetchVersions()]);
    } catch (err) {
      console.error("Error restoring version:", err);
    } finally {
      setRestoringVersion(false);
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
        <div className="space-y-6">
          {/* Project Header Section */}
          <CollapsibleSection title="Project Details" defaultExpanded={true}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProject.title || ""}
                    onChange={(e) =>
                      setEditedProject({ ...editedProject, title: e.target.value })
                    }
                    className="w-full text-xl mb-1 p-2 rounded-lg"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.text.primary,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  />
                ) : (
                  <h1 className="text-2xl font-bold mb-1" style={{ color: currentTheme.colors.primary }}>
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
                    className="w-full text-sm p-2 rounded-lg"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.text.secondary,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  />
                ) : (
                  project.subtitle && (
                    <p style={{ color: currentTheme.colors.text.secondary }} className="text-sm">
                      {project.subtitle}
                    </p>
                  )
                )}
              </div>
              <div className="flex gap-2">
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
          </CollapsibleSection>

          {/* README Section */}
          <CollapsibleSection title="README" defaultExpanded={true}>
            <ReadmeEditor projectId={params.id} />
          </CollapsibleSection>

          {/* GitHub Integration Section */}
          <CollapsibleSection title="GitHub Integration" defaultExpanded={true}>
            <GitHubRepoLink projectId={params.id} />
          </CollapsibleSection>

          {/* Project Sections */}
          <CollapsibleSection title="Project Sections" defaultExpanded={true}>
            <SectionEditor 
              projectId={params.id} 
              initialSections={project.sections}
              onSectionsChange={(updatedSections: Section[]) => {
                setProject(prev => prev ? {
                  ...prev,
                  sections: updatedSections
                } : null)
              }}
            />
          </CollapsibleSection>

          {/* Version History Section */}
          <CollapsibleSection title="Version History" defaultExpanded={false}>
            <div className="space-y-4">
              <div className="mb-4">
                <textarea
                  value={versionReason}
                  onChange={(e) => setVersionReason(e.target.value)}
                  placeholder="Enter a reason for creating a new version..."
                  className="w-full p-2 rounded-md text-sm"
                  style={{
                    backgroundColor: currentTheme.colors.cardBackground,
                    color: currentTheme.colors.text.primary,
                    borderColor: currentTheme.colors.border.default,
                  }}
                  rows={2}
                />
                <button
                  onClick={createVersion}
                  disabled={creatingVersion || !versionReason.trim()}
                  className="mt-2 px-4 py-2 rounded-md text-sm font-medium w-full transition-colors duration-200"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text.primary,
                    opacity: creatingVersion || !versionReason.trim() ? 0.7 : 1,
                  }}
                >
                  {creatingVersion ? "Creating..." : "Create Version"}
                </button>
              </div>

              <div className="space-y-2">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      border: `1px solid ${currentTheme.colors.border.default}`,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium" style={{ color: currentTheme.colors.text.primary }}>
                          Version {version.version}
                        </div>
                        {version.reason && (
                          <div className="text-sm mt-1" style={{ color: currentTheme.colors.text.secondary }}>
                            {version.reason}
                          </div>
                        )}
                        <div className="text-xs mt-1" style={{ color: currentTheme.colors.text.muted }}>
                          {new Date(version.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => restoreVersion(version.id)}
                        disabled={restoringVersion}
                        className="px-3 py-1 rounded text-sm transition-colors duration-200"
                        style={{
                          backgroundColor: currentTheme.colors.secondary,
                          color: currentTheme.colors.text.primary,
                          opacity: restoringVersion ? 0.7 : 1,
                        }}
                      >
                        {restoringVersion ? "Restoring..." : "Restore"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Activity Log Section */}
          <CollapsibleSection title="Activity Log" defaultExpanded={false}>
            <div className="space-y-2">
              {project.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="text-sm"
                  style={{ color: currentTheme.colors.text.secondary }}
                >
                  {new Date(activity.createdAt).toLocaleString()}: {activity.content}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
} 