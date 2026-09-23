import Image from "next/image";
import type { SiteContent } from "@/lib/types";

export default function About({ content }: { content: SiteContent }) {
  const paragraphs = content.about_text.split("\n").filter(Boolean);

  return (
    <section id="about" className="border-b border-white/5 bg-surface/40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-[1fr_2fr] md:py-28">
        <div>
          <p className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-secondary">About</p>
          {content.about_photo_url && (
            <div className="relative mt-4 aspect-square w-full max-w-[420px] overflow-hidden rounded-lg">
              <Image
                src={content.about_photo_url}
                alt={`Portrait of ${content.hero_name}`}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          )}
        </div>
        <div className="space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
