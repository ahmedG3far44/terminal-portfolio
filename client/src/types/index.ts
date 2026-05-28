export type ContactType =
  | 'linkedin'
  | 'github'
  | 'x'
  | 'instagram'
  | 'email'
  | 'phone'
  | 'website'
  | 'youtube'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'other';

export interface Contact {
  _id?: string;
  id?: string;
  type: ContactType;
  value: string;
  label?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  availableForHire: boolean;
}

export interface Project {
  _id?: string;
  id?: string;
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

export interface SectionStyles {
  pageContainer?: Record<string, string>;
  pageBackground?: Record<string, string>;
  heroContainer?: Record<string, string>;
  heroLabel?: Record<string, string>;
  heroName?: Record<string, string>;
  heroBio?: Record<string, string>;
  heroSkillsContainer?: Record<string, string>;
  heroSkillPill?: Record<string, string>;
  heroAvailableHire?: Record<string, string>;
  heroContactsContainer?: Record<string, string>;
  heroContactLink?: Record<string, string>;
  gitHubBoardContainer?: Record<string, string>;
  projectsContainer?: Record<string, string>;
  projectsLabel?: Record<string, string>;
  projectsGrid?: Record<string, string>;
  projectCard?: Record<string, string>;
  projectCardOverlay?: Record<string, string>;
  projectCardTitle?: Record<string, string>;
  projectCardDescription?: Record<string, string>;
  projectCardTechStack?: Record<string, string>;
}

export interface PortfolioCustomization {
  styles?: SectionStyles;
  rawCss?: string;
}

export interface Portfolio {
  _id?: string;
  personalInfo: PersonalInfo;
  skills: string[];
  projects: Project[];
  contacts: Contact[];
  activeTheme?: string;
  customization?: PortfolioCustomization;
  showGitHubBoard?: boolean;
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


// landing page 

export type PersonaId = 'developer' | 'designer' | 'product-manager' | 'marketer';

export interface PersonaInfo {
  id: PersonaId;
  name: string;
  role: string;
  description: string;
  accentClass: string;
  borderColor: string;
  themeLabel: string;
}

export interface CustomHeroConfig {
  developer: {
    commandLine: string;
    titleFirstPart: string;
    titleHighlight: string;
    titleLastPart: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    showFiles: boolean;
  };
  designer: {
    badgeText: string;
    titleHighlight: string;
    titleNormal: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    activeCanvasColor: string;
    canvasShape: 'circle' | 'square' | 'triangle' | 'star';
  };
  'product-manager': {
    metricBadge: string;
    titleHighlight: string;
    titleNormal: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    showRoiCalculator: boolean;
    initialTraffic: number;
    initialCvRate: number; // in percent
  };
  marketer: {
    topBadge: string;
    titleFirstPart: string;
    titleHighlight: string;
    titleLastPart: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    socialProofCount: string;
    pricingTier: 'starter' | 'pro' | 'enterprise';
  };
}
