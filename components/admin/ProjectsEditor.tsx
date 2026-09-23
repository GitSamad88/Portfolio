"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/types";
import MediaUploader from "./MediaUploader";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

function inputClass() {
  return "w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-[#edeef3] outline-none focus:border-[#e8a33d]";
}

function ProjectRow({
  project,
  onSave,
  onDelete,
  onMove,
}: {
  project: Project;
  onSave: (p: Project) => Promise<void>;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
}) {
  const [local, setLocal] = useState(project);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(local) !== JSON.stringify(project);

  function set<K extends keyof Project>(key: K, value: Project[K]) {
    setLocal((p) => ({ ...p, [key]: value }));
  }

  return (
    <div className="rounded-md border border-white/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-col">
          <button type="button" onClick={() => onMove("up")} className="text-[#8b90a6] hover:text-[#e8a33d]" aria-label="Move up">
            <ChevronUp size={16} />
          </button>
          <button type="button" onClick={() => onMove("down")} className="text-[#8b90a6] hover:text-[#e8a33d]" aria-label="Move down">
            <ChevronDown size={16} />
          </button>
        </div>
        <input
          className={inputClass()}
          value={local.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Project title"
        />
        <button type="button" onClick={onDelete} className="rounded p-2 text-[#8b90a6] hover:text-red-400" aria-label="Delete">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <textarea
          className={inputClass()}
          rows={2}
          placeholder="Description"
          value={local.description}
          onChange={(e) => set("description", e.target.value)}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MediaUploader label="Image" value={local.image_url} onChange={(url) => set("image_url", url)} accept="image/*" />
          <MediaUploader
            label="Video"
            value={local.video_url}
            onChange={(url) => set("video_url", url)}
            accept="video/*"
            hint="Upload a clip, or paste a YouTube/Vimeo link."
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-[#8b90a6]">Tags, separated by commas</label>
          <input
            className={inputClass()}
            value={local.tags.join(", ")}
            onChange={(e) => set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-[#8b90a6]">Link (project URL, repo, case study...)</label>
          <input className={inputClass()} value={local.link ?? ""} onChange={(e) => set("link", e.target.value || null)} />
        </div>

        <button
          type="button"
          disabled={!dirty || saving}
          onClick={async () => {
            setSaving(true);
            await onSave(local);
            setSaving(false);
          }}
          className="rounded-md bg-[#4fb0a5] px-4 py-1.5 text-sm font-medium text-[#12141f] hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving..." : dirty ? "Save project" : "Saved"}
        </button>
      </div>
    </div>
  );
}

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  async function addProject() {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New project", sort_order: projects.length }),
    });
    const created = await res.json();
    setProjects((p) => [...p, created]);
  }

  async function saveProject(p: Project) {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const updated = await res.json();
    setProjects((all) => all.map((x) => (x.id === p.id ? updated : x)));
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((all) => all.filter((x) => x.id !== id));
  }

  async function moveProject(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const withOrder = reordered.map((p, i) => ({ ...p, sort_order: i }));
    setProjects(withOrder);

    await Promise.all(
      withOrder.map((p) =>
        fetch(`/api/projects/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        })
      )
    );
  }

  if (loading) return <p className="text-[#8b90a6]">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <button
        type="button"
        onClick={addProject}
        className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-sm text-[#edeef3] hover:border-[#e8a33d]"
      >
        <Plus size={14} /> Add project
      </button>

      {projects.length === 0 && <p className="text-[#8b90a6]">No projects yet. Add your first one above.</p>}

      {projects.map((project, i) => (
        <ProjectRow
          key={project.id}
          project={project}
          onSave={saveProject}
          onDelete={() => deleteProject(project.id)}
          onMove={(direction) => moveProject(i, direction)}
        />
      ))}
    </div>
  );
}
