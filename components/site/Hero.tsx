import Image from "next/image";
import NodeGraph from "./NodeGraph";
import type { SiteContent } from "@/lib/types";

export default function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="dot-grid pointer-events-none absolute inset-0" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
        <div className="relative z-10">
          {/* Mobile only: name + role on the left, small photo on the right */}
          <div className="mb-4 flex items-start justify-between gap-4 sm:hidden">
            <div>
              <p className="mb-2 font-display text-sm uppercase tracking-[0.2em] text-secondary">
                {content.hero_role}
              </p>
              <h1 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink">
                {content.hero_name}
              </h1>
            </div>
            {content.hero_photo_url && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/60 shadow-lg">
                <Image
                  src={content.hero_photo_url}
                  alt={content.hero_name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Desktop: name + role at full size (mobile version above takes over below sm) */}
          <div className="hidden sm:block">
            <p className="mb-4 font-display text-sm uppercase tracking-[0.2em] text-secondary">
              {content.hero_role}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {content.hero_name}
            </h1>
          </div>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{content.hero_tagline}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-md bg-primary px-6 py-3 font-medium text-bg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-white/15 px-6 py-3 font-medium text-ink transition hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Desktop only: network graphic with the photo overlaid on top of it */}
        <div className="relative z-10 hidden items-center justify-center gap-8 sm:flex">
          <div className="h-[320px] w-full max-w-[420px]">
            <NodeGraph />
          </div>
          {content.hero_photo_url && (
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-primary/60 shadow-2xl">
              <Image
                src={content.hero_photo_url}
                alt={content.hero_name}
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
