"use client";

import { useEffect, useState } from "react";
import type { ThemeSettings, FontKey } from "@/lib/types";
import { FONT_PRESETS } from "@/lib/types";

type FormState = Omit<ThemeSettings, "id" | "updated_at">;

const COLOR_FIELDS: { key: keyof FormState; label: string }[] = [
  { key: "color_bg", label: "Background" },
  { key: "color_surface", label: "Surface (cards/sections)" },
  { key: "color_primary", label: "Primary accent" },
  { key: "color_secondary", label: "Secondary accent" },
  { key: "color_text", label: "Text" },
  { key: "color_muted", label: "Muted text" },
];

export default function ThemeEditor() {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/theme")
      .then((r) => r.json())
      .then((data) =>
        setForm({
          color_bg: data.color_bg,
          color_surface: data.color_surface,
          color_primary: data.color_primary,
          color_secondary: data.color_secondary,
          color_text: data.color_text,
          color_muted: data.color_muted,
          font_display: data.font_display,
          font_body: data.font_body,
        })
      );
  }, []);

  if (!form) return <p className="text-[#8b90a6]">Loading...</p>;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved. Refresh your homepage to see it live." : "Something went wrong while saving.");
  }

  const previewStyle = {
    backgroundColor: form.color_bg,
    color: form.color_text,
  };

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#edeef3]">Colors</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1 block text-sm text-[#8b90a6]">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value as FormState[typeof key])}
                    className="h-9 w-9 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                  <input
                    type="text"
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value as FormState[typeof key])}
                    className="w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-sm text-[#edeef3] outline-none focus:border-[#e8a33d]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-[#edeef3]">Fonts</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#8b90a6]">Headings</label>
              <select
                value={form.font_display}
                onChange={(e) => set("font_display", e.target.value as FontKey)}
                className="w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-[#edeef3]"
              >
                {Object.entries(FONT_PRESETS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#8b90a6]">Body text</label>
              <select
                value={form.font_body}
                onChange={(e) => set("font_body", e.target.value as FontKey)}
                className="w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-[#edeef3]"
              >
                {Object.entries(FONT_PRESETS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#e8a33d] px-5 py-2 font-medium text-[#12141f] hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save theme"}
          </button>
          {message && <span className="text-sm text-[#8b90a6]">{message}</span>}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-[#8b90a6]">Color preview</p>
        <div style={previewStyle} className="rounded-lg border border-white/10 p-5">
          <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: form.color_secondary }}>
            Preview
          </p>
          <p className="mb-2 text-xl font-bold">Your name here</p>
          <p className="mb-4 text-sm" style={{ color: form.color_muted }}>
            This is how your muted body text will look against the background.
          </p>
          <span
            className="inline-block rounded-md px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: form.color_primary, color: form.color_bg }}
          >
            Primary button
          </span>
        </div>
      </div>
    </div>
  );
}
