import Image from "next/image";
import type { Project } from "@/lib/types";
import { getVideoEmbedUrl, isDirectVideoFile } from "@/lib/media";

export default function ProjectCard({ project }: { project: Project }) {
  const embedUrl = project.video_url ? getVideoEmbedUrl(project.video_url) : null;
  const isDirectVideo = project.video_url ? isDirectVideoFile(project.video_url) : false;

  const CardInner = (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-surface transition hover:border-primary/50">
      <span className="absolute -left-1.5 top-7 h-3 w-3 rounded-full border-2 border-bg bg-primary" aria-hidden />

      <div className="relative aspect-video w-full overflow-hidden bg-bg">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={project.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isDirectVideo && project.video_url ? (
          <video src={project.video_url} controls className="h-full w-full object-cover" />
        ) : project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">No preview</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-lg font-semibold text-ink">{project.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted">{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-bg px-2.5 py-1 font-body text-xs text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {CardInner}
      </a>
    );
  }

  return CardInner;
}
