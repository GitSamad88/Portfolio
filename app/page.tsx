import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { SiteContent, Project, ThemeSettings } from "@/lib/types";
import { FONT_PRESETS } from "@/lib/types";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Projects from "@/components/site/Projects";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

// Always fetch fresh data so admin edits show up immediately.
// Both lines are required: dynamic alone doesn't stop Next.js from
// caching the fetch Supabase makes internally to reach the database.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getData() {
  const [{ data: content }, { data: projects }, { data: theme }] = await Promise.all([
    supabase.from("site_content").select("*").eq("id", 1).single(),
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("theme_settings").select("*").eq("id", 1).single(),
  ]);

  return {
    content: content as SiteContent | null,
    projects: (projects ?? []) as Project[],
    theme: theme as ThemeSettings | null,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { data: content } = await supabase.from("site_content").select("hero_name, hero_role, hero_tagline").eq("id", 1).single();
  if (!content) return { title: "Portfolio" };
  return {
    title: `${content.hero_name} — ${content.hero_role}`,
    description: content.hero_tagline,
  };
}

export default async function HomePage() {
  const { content, projects, theme } = await getData();

  if (!content || !theme) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#12141f] px-6 text-center text-[#edeef3]">
        <div>
          <p className="text-lg font-semibold">Portfolio not set up yet</p>
          <p className="mt-2 max-w-md text-sm text-[#8b90a6]">
            Run the Supabase schema (supabase/schema.sql) and check your environment variables, then refresh.
          </p>
        </div>
      </main>
    );
  }

  const themeStyle: CSSProperties = {
    "--color-bg": theme.color_bg,
    "--color-surface": theme.color_surface,
    "--color-primary": theme.color_primary,
    "--color-secondary": theme.color_secondary,
    "--color-text": theme.color_text,
    "--color-muted": theme.color_muted,
    "--font-display": `var(${FONT_PRESETS[theme.font_display]?.var ?? FONT_PRESETS["space-grotesk"].var})`,
    "--font-body": `var(${FONT_PRESETS[theme.font_body]?.var ?? FONT_PRESETS["inter"].var})`,
  } as CSSProperties;

  return (
    <main id="top" style={themeStyle} className="min-h-screen bg-bg text-ink">
      <Header name={content.hero_name} />
      <Hero content={content} />
      <About content={content} />
      <Skills skills={content.skills} />
      <Projects projects={projects} />
      <Contact email={content.contact_email} socials={content.contact_socials} resumeUrl={content.resume_url} />
      <Footer name={content.hero_name} />
    </main>
  );
}
