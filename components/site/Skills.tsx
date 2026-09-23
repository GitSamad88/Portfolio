import type { SkillGroup } from "@/lib/types";

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="border-b border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-10 font-display text-sm uppercase tracking-[0.2em] text-secondary">Toolkit</p>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="mb-4 font-display text-lg font-semibold text-ink">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-surface px-3 py-1 font-body text-sm text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
