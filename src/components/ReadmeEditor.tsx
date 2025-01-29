'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ReactMarkdown from 'react-markdown';

interface ReadmeVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  message?: string;
}

interface Readme {
  id: string;
  content: string;
  versions: ReadmeVersion[];
  updatedAt: string;
}

interface ReadmeEditorProps {
  projectId: string;
  initialReadme?: Readme;
}

export function ReadmeEditor({ projectId, initialReadme }: ReadmeEditorProps) {
  const { currentTheme } = useTheme();
  const [readme, setReadme] = useState<Readme | null>(initialReadme || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [loading, setLoading] = useState(!initialReadme);
  const [error, setError] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    if (!initialReadme) {
      fetchReadme();
    }
  }, [projectId, initialReadme]);

  const fetchReadme = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/readme`);
      if (response.ok) {
        const data = await response.json();
        setReadme(data);
      } else if (response.status === 404) {
        // README doesn't exist yet, that's okay
        setReadme(null);
      } else {
        throw new Error('Failed to fetch README');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedContent(readme?.content || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/readme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editedContent,
          message: commitMessage,
        }),
      });

      if (!response.ok) throw new Error('Failed to update README');

      const updatedReadme = await response.json();
      setReadme(updatedReadme);
      setIsEditing(false);
      setCommitMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm('Are you sure you want to restore this version? Current content will be overwritten.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/readme/restore/${versionId}`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to restore version');

      const updatedReadme = await response.json();
      setReadme(updatedReadme);
      setShowVersions(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse" style={{ color: currentTheme.colors.text.secondary }}>
        Loading README...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: currentTheme.colors.status.inactive.text }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: currentTheme.colors.primary }}>
          README
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="px-3 py-1 rounded-md text-sm transition-colors duration-200"
            style={{
              backgroundColor: currentTheme.colors.cardBackground,
              color: currentTheme.colors.text.primary,
              border: `1px solid ${currentTheme.colors.border.default}`,
            }}
          >
            {showVersions ? 'Hide History' : 'Show History'}
          </button>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-3 py-1 rounded-md text-sm transition-colors duration-200"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.background,
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {showVersions && readme && readme.versions && readme.versions.length > 0 && (
        <div 
          className="mb-4 p-4 rounded-lg space-y-2"
          style={{
            backgroundColor: currentTheme.colors.cardBackground,
            border: `1px solid ${currentTheme.colors.border.default}`,
          }}
        >
          <h3 className="font-medium mb-2" style={{ color: currentTheme.colors.text.primary }}>
            Version History
          </h3>
          {readme.versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between p-2 rounded"
              style={{
                backgroundColor: currentTheme.colors.background,
                border: `1px solid ${currentTheme.colors.border.default}`,
              }}
            >
              <div>
                <span className="text-sm font-medium" style={{ color: currentTheme.colors.text.primary }}>
                  Version {version.version}
                </span>
                {version.message && (
                  <p className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                    {version.message}
                  </p>
                )}
                <span className="text-xs" style={{ color: currentTheme.colors.text.muted }}>
                  {new Date(version.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleRestore(version.id)}
                className="px-2 py-1 rounded text-xs transition-colors duration-200"
                style={{
                  backgroundColor: currentTheme.colors.secondary,
                  color: currentTheme.colors.text.primary,
                }}
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-[500px] p-4 font-mono text-sm rounded-lg"
            style={{
              backgroundColor: currentTheme.colors.cardBackground,
              color: currentTheme.colors.text.primary,
              border: `1px solid ${currentTheme.colors.border.default}`,
            }}
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes (optional)"
              className="flex-1 px-3 py-2 rounded-lg"
              style={{
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text.primary,
                border: `1px solid ${currentTheme.colors.border.default}`,
              }}
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.background,
              }}
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              style={{
                backgroundColor: currentTheme.colors.cardBackground,
                color: currentTheme.colors.text.primary,
                border: `1px solid ${currentTheme.colors.border.default}`,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className="prose prose-invert max-w-none p-6 rounded-lg"
          style={{
            backgroundColor: currentTheme.colors.cardBackground,
            border: `1px solid ${currentTheme.colors.border.default}`,
            color: currentTheme.colors.text.primary,
          }}
        >
          {readme ? (
            <ReactMarkdown>{readme.content}</ReactMarkdown>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: currentTheme.colors.text.secondary }}>
                No README yet. Click "Edit" to create one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 