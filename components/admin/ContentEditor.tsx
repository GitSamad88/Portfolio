"use client";

import { useEffect, useState } from "react";
import type { SiteContent, SkillGroup, ContactSocials } from "@/lib/types";
import MediaUploader from "./MediaUploader";
import { Plus, Trash2 } from "lucide-react";

type FormState = Omit<SiteContent, "id" | "updated_at">;

const EMPTY: FormState = {
  hero_name: "",
  hero_role: "",
  hero_tagline: "",
  hero_photo_url: null,
  about_text: "",
  about_photo_url: null,
  skills: [],
  resume_url: null,
  contact_email: null,
  contact_socials: {},
};

function inputClass() {
  return "w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-[#edeef3] outline-none focus:border-[#e8a33d]";
}

export default function ContentEditor() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          hero_name: data.hero_name ?? "",
          hero_role: data.hero_role ?? "",
          hero_tagline: data.hero_tagline ?? "",
          hero_photo_url: data.hero_photo_url,
          about_text: data.about_text ?? "",
          about_photo_url: data.about_photo_url,
          skills: data.skills ?? [],
          resume_url: data.resume_url,
          contact_email: data.contact_email,
          contact_socials: data.contact_socials ?? {},
        });
        setLoading(false);
      });
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setSocial(key: keyof ContactSocials, value: string) {
    setForm((f) => ({ ...f, contact_socials: { ...f.contact_socials, [key]: value || undefined } }));
  }

  function updateSkillGroup(index: number, patch: Partial<SkillGroup>) {
    setForm((f) => {
      const skills = [...f.skills];
      skills[index] = { ...skills[index], ...patch };
      return { ...f, skills };
    });
  }

  function addSkillGroup() {
    setForm((f) => ({ ...f, skills: [...f.skills, { category: "New category", items: [] }] }));
  }

  function removeSkillGroup(index: number) {
    setForm((f) => ({ ...f, skills: f.skills.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved." : "Something went wrong while saving.");
  }

  if (loading) return <p className="text-[#8b90a6]">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#edeef3]">Hero</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#8b90a6]">Name</label>
            <input className={inputClass()} value={form.hero_name} onChange={(e) => set("hero_name", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#8b90a6]">Role / title</label>
            <input className={inputClass()} value={form.hero_role} onChange={(e) => set("hero_role", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#8b90a6]">Tagline</label>
            <textarea
              className={inputClass()}
              rows={2}
              value={form.hero_tagline}
              onChange={(e) => set("hero_tagline", e.target.value)}
            />
          </div>
          <MediaUploader
            label="Hero photo"
            value={form.hero_photo_url}
            onChange={(url) => set("hero_photo_url", url)}
            accept="image/*"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#edeef3]">About</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#8b90a6]">
              Bio (each new line becomes a paragraph)
            </label>
            <textarea
              className={inputClass()}
              rows={6}
              value={form.about_text}
              onChange={(e) => set("about_text", e.target.value)}
            />
          </div>
          <MediaUploader
            label="About photo"
            value={form.about_photo_url}
            onChange={(url) => set("about_photo_url", url)}
            accept="image/*"
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#edeef3]">Skills</h2>
          <button
            type="button"
            onClick={addSkillGroup}
            className="flex items-center gap-1 rounded-md border border-white/10 px-3 py-1.5 text-sm text-[#edeef3] hover:border-[#e8a33d]"
          >
            <Plus size={14} /> Add group
          </button>
        </div>
        <div className="space-y-4">
          {form.skills.map((group, i) => (
            <div key={i} className="rounded-md border border-white/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <input
                  className={inputClass()}
                  value={group.category}
                  onChange={(e) => updateSkillGroup(i, { category: e.target.value })}
                  placeholder="Category name"
                />
                <button
                  type="button"
                  onClick={() => removeSkillGroup(i)}
                  className="rounded p-2 text-[#8b90a6] hover:text-red-400"
                  aria-label="Remove group"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <label className="mb-1 block text-xs text-[#8b90a6]">Skills, separated by commas</label>
              <input
                className={inputClass()}
                value={group.items.join(", ")}
                onChange={(e) =>
                  updateSkillGroup(i, {
                    items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-[#edeef3]">Contact</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-[#8b90a6]">Email</label>
            <input
              className={inputClass()}
              value={form.contact_email ?? ""}
              onChange={(e) => set("contact_email", e.target.value || null)}
            />
          </div>
          <MediaUploader
            label="Résumé / CV"
            value={form.resume_url}
            onChange={(url) => set("resume_url", url)}
            accept=".pdf"
            hint="Upload a PDF, or paste a link to one."
          />
          {(["github", "linkedin", "upwork", "fiverr", "x", "website"] as const).map((key) => (
            <div key={key}>
              <label className="mb-1 block text-sm capitalize text-[#8b90a6]">{key}</label>
              <input
                className={inputClass()}
                value={form.contact_socials[key] ?? ""}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-md border border-white/10 bg-[#1b1e2e] p-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[#e8a33d] px-5 py-2 font-medium text-[#12141f] hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && <span className="text-sm text-[#8b90a6]">{message}</span>}
      </div>
    </div>
  );
}
