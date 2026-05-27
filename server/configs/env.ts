import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  MONGODB_URI: required('MONGODB_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_ADMIN_SECRET: required('JWT_ADMIN_SECRET'),
  GITHUB_CLIENT_ID: required('GITHUB_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: required('GITHUB_CLIENT_SECRET'),
  GITHUB_USERNAME: required('GITHUB_USERNAME'),
  GITHUB_TOKEN: required('GITHUB_TOKEN'),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
