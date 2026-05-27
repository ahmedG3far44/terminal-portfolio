import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { http } from '../services/http';
import { useAuth } from './AuthContext';
import { useQuery, useMutation } from '../hooks/useQuery';
import type { Portfolio, PersonalInfo, Project } from '../types';

interface AdminContextType {
  data: Portfolio | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => Promise<void>;
  addProject: (project: Omit<Project, '_id'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSkill: (skill: string) => Promise<void>;
  deleteSkill: (skill: string) => Promise<void>;
  resetData: () => Promise<void>;
  saving: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  const portfolioQuery = useQuery(
    (signal) => http.get<Portfolio>('/portfolio', { signal }),
    [token],
  );

  const [saving, setSaving] = useState(false);

  const updatePersonalInfo = useCallback(async (info: Partial<PersonalInfo>) => {
    setSaving(true);
    try {
      await http.put('/portfolio', { personalInfo: info });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const addProject = useCallback(async (project: Omit<Project, '_id'>) => {
    setSaving(true);
    try {
      const current = portfolioQuery.data;
      if (!current) return;
      await http.put('/portfolio', {
        projects: [...current.projects, project],
      });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const updateProject = useCallback(async (id: string, updates: Partial<Project>) => {
    setSaving(true);
    try {
      const current = portfolioQuery.data;
      if (!current) return;
      const projects = current.projects.map((p) =>
        (p._id || p.id) === id ? { ...p, ...updates } : p,
      );
      await http.put('/portfolio', { projects });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const deleteProject = useCallback(async (id: string) => {
    setSaving(true);
    try {
      const current = portfolioQuery.data;
      if (!current) return;
      const projects = current.projects.filter(
        (p) => (p._id || p.id) !== id,
      );
      await http.put('/portfolio', { projects });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const addSkill = useCallback(async (skill: string) => {
    setSaving(true);
    try {
      const current = portfolioQuery.data;
      if (!current) return;
      if (current.skills.includes(skill)) return;
      await http.put('/portfolio', {
        skills: [...current.skills, skill],
      });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const deleteSkill = useCallback(async (skill: string) => {
    setSaving(true);
    try {
      const current = portfolioQuery.data;
      if (!current) return;
      const skills = current.skills.filter((s) => s !== skill);
      await http.put('/portfolio', { skills });
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  const resetData = useCallback(async () => {
    setSaving(true);
    try {
      await http.post('/portfolio/reset');
      portfolioQuery.refetch();
    } finally {
      setSaving(false);
    }
  }, [portfolioQuery]);

  return (
    <AdminContext.Provider
      value={{
        data: portfolioQuery.data,
        loading: portfolioQuery.loading,
        error: portfolioQuery.error,
        refetch: portfolioQuery.refetch,
        updatePersonalInfo,
        addProject,
        updateProject,
        deleteProject,
        addSkill,
        deleteSkill,
        resetData,
        saving,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
