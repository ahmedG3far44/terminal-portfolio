export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  availableForHire: boolean;
  email: string;
  linkedin: string;
  github: string;
}

export interface Project {
  _id?: string;
  slug: string;
  title: string;
  description: string;
  repoUrl: string;
  liveDemoUrl: string;
  tags: string[];
  techStack: string[];
  tools: string[];
  coverImage: string | null;
}

export interface Portfolio {
  personalInfo: PersonalInfo;
  skills: string[];
  projects: Project[];
  activeTheme?: string;
}

export interface Theme {
  _id?: string;
  name: string;
  slug: string;
  primary: string;
  rgb: string;
  isActive: boolean;
}

export interface GitHubContributions {
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalReviews: number;
  totalIssues: number;
  contributions: { date: string; count: number; color: string }[];
  currentStreak: number;
  longestStreak: number;
}

export interface GitHubRepo {
  name: string;
  nameWithOwner: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  languages: string[];
  updatedAt: string;
}

export interface User {
  _id: string;
  githubId: string;
  username: string;
  avatarUrl: string;
  profileUrl: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string;
}

export interface AdminUser {
  _id: string;
  email: string;
  username: string;
  role: 'super_admin';
}

export interface AdminInsights {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalSkills: number;
  totalThemes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
