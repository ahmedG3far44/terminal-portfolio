import mongoose, { Schema, Document } from 'mongoose';

export interface IContact {
  _id?: mongoose.Types.ObjectId;
  type: string;
  value: string;
  label?: string;
}

export interface IProject {
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

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    availableForHire: boolean;
  };
  skills: string[];
  projects: IProject[];
  contacts: IContact[];
  activeTheme: string;
  showGitHubBoard: boolean;
  customization: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    type: { type: String, required: true },
    value: { type: String, required: true },
    label: { type: String, default: '' },
  },
  { timestamps: false }
);

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    liveDemoUrl: { type: String, default: '' },
    tags: [{ type: String }],
    techStack: [{ type: String }],
    tools: [{ type: String }],
    coverImage: { type: String, default: null },
  },
  { timestamps: false }
);

const portfolioSchema = new Schema<IPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    personalInfo: {
      name: { type: String, default: '' },
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      availableForHire: { type: Boolean, default: true },
    },
    skills: [{ type: String }],
    projects: [projectSchema],
    contacts: [contactSchema],
    activeTheme: { type: String, default: 'green' },
    showGitHubBoard: { type: Boolean, default: true },
    customization: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
