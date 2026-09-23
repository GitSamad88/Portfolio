import { Mail, Github, Linkedin, Briefcase, ExternalLink } from "lucide-react";
import type { ContactSocials } from "@/lib/types";

const SOCIAL_ICON: Record<keyof ContactSocials, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  upwork: <Briefcase size={18} />,
  fiverr: <Briefcase size={18} />,
  x: <ExternalLink size={18} />,
  website: <ExternalLink size={18} />,
};

const SOCIAL_LABEL: Record<keyof ContactSocials, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  upwork: "Upwork",
  fiverr: "Fiverr",
  x: "X / Twitter",
  website: "Website",
};

export default function Contact({
  email,
  socials,
  resumeUrl,
}: {
  email: string | null;
  socials: ContactSocials;
  resumeUrl: string | null;
}) {
  const links = (Object.keys(socials) as (keyof ContactSocials)[]).filter((k) => socials[k]);

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-20 text-center md:py-28">
      <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-secondary">Contact</p>
      <h2 className="mx-auto max-w-xl font-display text-3xl font-bold text-ink sm:text-4xl">
        Let&apos;s build something automated.
      </h2>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-medium text-bg transition hover:opacity-90"
          >
            <Mail size={18} /> {email}
          </a>
        )}
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/15 px-5 py-3 font-medium text-ink transition hover:border-white/30"
          >
            View résumé
          </a>
        )}
      </div>

      {links.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {links.map((key) => (
            <a
              key={key}
              href={socials[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted transition hover:text-secondary"
            >
              {SOCIAL_ICON[key]} {SOCIAL_LABEL[key]}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
