export type ColorMode = 'dark' | 'light';

export interface ColorTokens {
  bg: string;
  surface: string;
  fg: string;
  textMuted: string;
  textDim: string;
  borderBase: string;
  borderSubtle: string;
  accent: string;
  accentRgb: string;
}

export const darkNeutrals = {
  bg: '#09090b',
  surface: '#141414',
  fg: '#fafafa',
  textMuted: '#a1a1aa',
  textDim: '#52525b',
  borderBase: '#1e1e24',
  borderSubtle: '#27272a',
};

export const lightNeutrals = {
  bg: '#fdf2f8',
  surface: '#ffffff',
  fg: '#18181b',
  textMuted: '#52525b',
  textDim: '#9ca3af',
  borderBase: '#e5e7eb',
  borderSubtle: '#d1d5db',
};

export const defaultAccent = '#ec4899';
export const defaultAccentRgb = '236, 72, 153';

export const themeVariants = [
  { slug: 'pink', name: 'Pink', primary: '#ec4899', rgb: '236, 72, 153' },
  { slug: 'purple', name: 'Vivid Purple', primary: '#a855f7', rgb: '168, 85, 247' },
  { slug: 'blue', name: 'Electric Blue', primary: '#3b82f6', rgb: '59, 130, 246' },
  { slug: 'skyblue', name: 'Sky Blue', primary: '#0ea5e9', rgb: '14, 165, 233' },
  { slug: 'green', name: 'Neon Green', primary: '#39ff14', rgb: '57, 255, 20' },
  { slug: 'zinc', name: 'Zinc', primary: '#71717a', rgb: '113, 113, 122' },
  { slug: 'amber', name: 'Amber', primary: '#f59e0b', rgb: '245, 158, 11' },
  { slug: 'rose', name: 'Rose', primary: '#f43f5e', rgb: '244, 63, 94' },
  { slug: 'cyan', name: 'Cyan', primary: '#06b6d4', rgb: '6, 182, 212' },
  { slug: 'emerald', name: 'Emerald', primary: '#10b981', rgb: '16, 185, 129' },
  { slug: 'orange', name: 'Orange', primary: '#f97316', rgb: '249, 115, 22' },
];

export function resolveTokens(mode: ColorMode, accent: string, accentRgb: string): ColorTokens {
  const neutrals = mode === 'dark' ? darkNeutrals : lightNeutrals;
  return { ...neutrals, accent, accentRgb };
}
