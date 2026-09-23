export type SkillGroup = {
  category: string;
  items: string[];
};

export type ContactSocials = {
  github?: string;
  linkedin?: string;
  upwork?: string;
  fiverr?: string;
  x?: string;
  website?: string;
};

export type SiteContent = {
  id: number;
  hero_name: string;
  hero_role: string;
  hero_tagline: string;
  hero_photo_url: string | null;
  about_text: string;
  about_photo_url: string | null;
  skills: SkillGroup[];
  resume_url: string | null;
  contact_email: string | null;
  contact_socials: ContactSocials;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  video_url: string | null;
  tags: string[];
  link: string | null;
  sort_order: number;
  created_at: string;
};

export const FONT_PRESETS = {
  "space-grotesk": { label: "Space Grotesk", var: "--font-space-grotesk" },
  inter: { label: "Inter", var: "--font-inter" },
  "plex-mono": { label: "IBM Plex Mono", var: "--font-plex-mono" },
  "plex-sans": { label: "IBM Plex Sans", var: "--font-plex-sans" },
  playfair: { label: "Playfair Display", var: "--font-playfair" },
  "source-sans": { label: "Source Sans 3", var: "--font-source-sans" },
  poppins: { label: "Poppins", var: "--font-poppins" },
  jetbrains: { label: "JetBrains Mono", var: "--font-jetbrains" },
} as const;

export type FontKey = keyof typeof FONT_PRESETS;

export type ThemeSettings = {
  id: number;
  color_bg: string;
  color_surface: string;
  color_primary: string;
  color_secondary: string;
  color_text: string;
  color_muted: string;
  font_display: FontKey;
  font_body: FontKey;
  updated_at: string;
};
