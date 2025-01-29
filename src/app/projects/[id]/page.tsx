'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/projects"
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Projects
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedProject.title || ""}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, title: e.target.value })
                }
                className="text-3xl font-bold w-full mb-2 p-2 border rounded"
              />
            ) : (
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            )}
            {isEditing ? (
              <input
                type="text"
                value={editedProject.subtitle || ""}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, subtitle: e.target.value })
                }
                className="text-xl text-gray-600 w-full p-2 border rounded"
              />
            ) : (
              project.subtitle && (
                <p className="text-xl text-gray-600">{project.subtitle}</p>
              )
            )}
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
              className="w-full h-32 p-2 border rounded"
            />
          ) : (
            project.description && (
              <p className="text-gray-700">{project.description}</p>
            )
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Sections</h2>
          {project.sections.map((section) => (
            <div key={section.id} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{section.title}</h3>
              <p className="text-gray-700">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Resources</h2>
          {project.resources.map((resource) => (
            <div key={resource.id} className="mb-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                {resource.title} ({resource.type})
              </a>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Activity</h2>
          {project.activities.map((activity) => (
            <div key={activity.id} className="mb-2 text-sm text-gray-600">
              {new Date(activity.createdAt).toLocaleString()}: {activity.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 