'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface GitHubRepoLinkProps {
  projectId: string;
}

interface GitHubRepo {
  id: string;
  repoUrl: string;
  repoName: string;
  ownerName: string;
  lastSynced: string;
  syncEnabled: boolean;
}

interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
}

export default function GitHubRepoLink({ projectId }: GitHubRepoLinkProps) {
  const { currentTheme } = useTheme();
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [availableRepos, setAvailableRepos] = useState<GithubRepository[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch current repository status
  useEffect(() => {
    async function fetchRepo() {
      try {
        const response = await fetch(`/api/projects/${projectId}/github`);
        const data = await response.json();
        if (data.githubRepo) {
          setRepo(data.githubRepo);
          setRepoUrl(data.githubRepo.repoUrl);
        }
        // console.log(data.githubRepo);
      } catch (error) {
        console.error('Error fetching repo:', error);
      }
    }
    fetchRepo();
  }, [projectId]);

  // Fetch available repositories
  useEffect(() => {
    async function fetchRepositories() {
      setIsLoadingRepos(true);
      try {
        const response = await fetch('/api/github/repositories');
        const data = await response.json();
        
        if (data.status === 'connected') {
          setAvailableRepos(data.repositories);
        } else if (data.status === 'no_connection' || data.status === 'token_expired') {
          setAvailableRepos([]);
          setError(
            data.status === 'no_connection' 
              ? 'Connect your GitHub account to get started' 
              : 'GitHub token expired. Please reconnect your account'
          );
        } else {
          setAvailableRepos([]);
          setError(data.error || 'Failed to load repositories');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
        setError('Failed to load repositories');
        setAvailableRepos([]);
      } finally {
        setIsLoadingRepos(false);
      }
    }
    fetchRepositories();
  }, []);

  // Filter repositories based on search term
  const filteredRepos = availableRepos.filter(repo => 
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Connect repository
  const handleConnect = async (selectedRepo: GithubRepository) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: selectedRepo.html_url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect repository');
      }

      setRepo(data.githubRepo);
      setRepoUrl('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to connect repository');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect repository
  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/github`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to disconnect repository');
      }

      setRepo(null);
      setRepoUrl('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to disconnect repository');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to handle GitHub connection
  const handleConnectGitHub = () => {
    window.location.href = '/api/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text.primary }}>
        GitHub Repository
      </h3>
      
      {repo ? (
        <div className="space-y-2">
          <div style={{ color: currentTheme.colors.text.secondary }} className="text-sm">
            Connected to: <span className="font-medium">{repo.repoUrl}</span>
          </div>
          <div style={{ color: currentTheme.colors.text.secondary }} className="text-xs">
            Last synced: {new Date(repo.lastSynced).toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="px-3 py-1 text-sm rounded-md transition-colors duration-200 disabled:opacity-50"
              style={{
                backgroundColor: currentTheme.colors.status.inactive.background,
                color: currentTheme.colors.status.inactive.text,
                border: `1px solid ${currentTheme.colors.border.default}`,
              }}
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
            Connect a GitHub repository to sync its README and keep it updated with your project.
          </div>
          
          {error && error.includes('Connect your GitHub account') ? (
            <div className="text-center py-4">
              <button
                onClick={handleConnectGitHub}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                  color: currentTheme.colors.background,
                }}
              >
                Connect GitHub Account
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your repositories..."
                className="w-full px-3 py-2 rounded-md border transition-colors duration-200"
                style={{
                  backgroundColor: currentTheme.colors.cardBackground,
                  borderColor: currentTheme.colors.border.default,
                  color: currentTheme.colors.text.primary,
                }}
              />
              
              {error && (
                <div className="p-3 rounded-md text-sm" style={{ 
                  backgroundColor: currentTheme.colors.status.inactive.background,
                  color: currentTheme.colors.status.inactive.text,
                  border: `1px solid ${currentTheme.colors.border.default}`,
                }}>
                  {error}
                  {error.includes('expired') && (
                    <button
                      onClick={handleConnectGitHub}
                      className="ml-2 underline"
                    >
                      Reconnect
                    </button>
                  )}
                </div>
              )}

              <div className="max-h-60 overflow-y-auto space-y-2">
                {isLoadingRepos ? (
                  <div className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                    Loading repositories...
                  </div>
                ) : filteredRepos.length > 0 ? (
                  <>
                    <div className="text-xs mb-2" style={{ color: currentTheme.colors.text.secondary }}>
                      Found {filteredRepos.length} repositories
                      {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-black/5"
                        style={{
                          backgroundColor: currentTheme.colors.cardBackground,
                          border: `1px solid ${currentTheme.colors.border.default}`,
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium" style={{ color: currentTheme.colors.text.primary }}>
                            {repo.full_name}
                          </div>
                          <div className="text-xs" style={{ color: currentTheme.colors.text.secondary }}>
                            {repo.private ? '🔒 Private' : '🌐 Public'} repository
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnect(repo)}
                          disabled={loading}
                          className="px-3 py-1 text-sm rounded-md transition-colors duration-200 disabled:opacity-50"
                          style={{
                            backgroundColor: currentTheme.colors.primary,
                            color: currentTheme.colors.background,
                          }}
                        >
                          {loading ? 'Connecting...' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-sm" style={{ color: currentTheme.colors.text.secondary }}>
                    {searchTerm ? `No repositories found matching "${searchTerm}"` : 'No repositories found'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 