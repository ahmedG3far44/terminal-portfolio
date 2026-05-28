import type { PortfolioCustomization } from '../types';
import { defaultSectionStyles } from './defaults';

export interface ResolvedStyles {
  sectionStyles: Record<string, Record<string, string>>;
  rawCss: string;
}

export function resolveSectionStyles(customization?: PortfolioCustomization | null): ResolvedStyles {
  const userStyles = customization?.styles || {};
  const allKeys = new Set([
    ...Object.keys(defaultSectionStyles),
    ...Object.keys(userStyles),
  ]);

  const sectionStyles: Record<string, Record<string, string>> = {};

  for (const key of allKeys) {
    sectionStyles[key] = {
      ...(defaultSectionStyles as any)[key] || {},
      ...(userStyles as any)[key] || {},
    };
  }

  return {
    sectionStyles,
    rawCss: customization?.rawCss || '',
  };
}
