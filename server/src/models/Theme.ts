import mongoose, { Schema, Document } from 'mongoose';

export interface ITheme extends Document {
  name: string;
  slug: string;
  primary: string;
  rgb: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const themeSchema = new Schema<ITheme>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    primary: { type: String, required: true },
    rgb: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Theme = mongoose.model<ITheme>('Theme', themeSchema);
