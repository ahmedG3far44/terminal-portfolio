import mongoose, { Schema, Document } from 'mongoose';

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
    email: string;
    linkedin: string;
    github: string;
  };
  skills: string[];
  projects: IProject[];
  activeTheme: string;
  createdAt: Date;
  updatedAt: Date;
}

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
      email: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    skills: [{ type: String }],
    projects: [projectSchema],
    activeTheme: { type: String, default: 'green' },
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
