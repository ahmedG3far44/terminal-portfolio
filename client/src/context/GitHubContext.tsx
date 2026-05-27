import { createContext, useContext, type ReactNode } from 'react';
import { http, HttpError } from '../services/http';
import { useQuery } from '../hooks/useQuery';
import { useAuth } from './AuthContext';
import type { GitHubContributions, GitHubRepo } from '../types';

interface GitHubContextType {
  contributions: GitHubContributions | null;
  repos: GitHubRepo[];
  loading: boolean;
  repoLoading: boolean;
  error: string | null;
  loadRepos: () => void;
  getReadme: (owner: string, repo: string) => Promise<string | null>;
}

const GitHubContext = createContext<GitHubContextType | null>(null);

function handleAuthError(err: unknown, logout: () => void) {
  if (err instanceof HttpError && err.needsReauth) {
    logout();
    window.location.href = '/api/auth/github';
  }
}

export function GitHubProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  const contribQuery = useQuery(
    (signal) =>
      http.get<GitHubContributions>('/github/contributions', { signal }).catch((err) => {
        handleAuthError(err, logout);
        throw err;
      }),
    [],
  );

  const reposQuery = useQuery(
    (signal) =>
      http.get<GitHubRepo[]>('/github/repos', { signal }).catch((err) => {
        handleAuthError(err, logout);
        throw err;
      }),
    [],
  );

  const loadRepos = () => reposQuery.refetch();

  const getReadme = async (owner: string, repo: string): Promise<string | null> => {
    try {
      return await http.get<string>(`/github/readme/${owner}/${repo}`);
    } catch {
      return null;
    }
  };

  return (
    <GitHubContext.Provider
      value={{
        contributions: contribQuery.data,
        repos: reposQuery.data || [],
        loading: contribQuery.loading,
        repoLoading: reposQuery.loading,
        error: contribQuery.error || reposQuery.error,
        loadRepos,
        getReadme,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (!context) throw new Error('useGitHub must be used within GitHubProvider');
  return context;
}
