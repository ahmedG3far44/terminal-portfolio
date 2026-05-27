import {
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Mail,
  Phone,
  Globe,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import type { ContactType } from '../types';

const iconMap: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  x: Twitter,
  twitter: Twitter,
  instagram: Instagram,
  email: Mail,
  phone: Phone,
  website: Globe,
  youtube: Youtube,
  dribbble: Globe,
  behance: Globe,
  medium: Globe,
  other: Globe,
};

export function getContactIcon(type: ContactType | string): LucideIcon {
  return iconMap[type] || Globe;
}
