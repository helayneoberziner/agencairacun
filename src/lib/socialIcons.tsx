import {
  Instagram, Youtube, Facebook, Linkedin, Twitter, Link as LinkIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const socialPlatforms = [
  'instagram', 'youtube', 'tiktok', 'linkedin', 'facebook',
  'behance', 'vimeo', 'twitter', 'pinterest', 'other',
] as const;

export type SocialPlatform = typeof socialPlatforms[number];

export function getSocialIcon(platform: string): LucideIcon {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return Instagram;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('facebook')) return Facebook;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('twitter') || p === 'x') return Twitter;
  return LinkIcon;
}

export function getSocialLabel(platform: string): string {
  const map: Record<string, string> = {
    instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok',
    linkedin: 'LinkedIn', facebook: 'Facebook', behance: 'Behance',
    vimeo: 'Vimeo', twitter: 'X (Twitter)', pinterest: 'Pinterest', other: 'Outro',
  };
  return map[platform.toLowerCase()] ?? platform;
}