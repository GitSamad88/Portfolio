import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="border-b border-white/5 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="mb-10 font-display text-sm uppercase tracking-[0.2em] text-secondary">Projects</p>
        {projects.length === 0 ? (
          <p className="text-muted">Projects added from the admin panel will appear here.</p>
        ) : (
          <div className="relative grid grid-cols-1 gap-8 pl-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
