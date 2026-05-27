import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  githubId: string;
  username: string;
  avatarUrl: string;
  profileUrl: string;
  email: string | null;
  isActive: boolean;
  githubAccessToken: string | null;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    email: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    githubAccessToken: { type: String, default: null },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
