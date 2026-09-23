"use client";

import { useState } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";

export default function MediaUploader({
  label,
  value,
  onChange,
  accept = "image/*,video/*",
  hint,
}: {
  label: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  accept?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const body = await res.json();

    setUploading(false);

    if (!res.ok) {
      setError(body.error || "Upload failed.");
      return;
    }

    onChange(body.url);
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-[#8b90a6]">{label}</label>
      {hint && <p className="mb-2 text-xs text-[#8b90a6]">{hint}</p>}

      {value ? (
        <div className="mb-2 flex items-center gap-3 rounded-md border border-white/10 bg-[#12141f] p-2">
          <span className="flex-1 truncate text-xs text-[#8b90a6]">{value}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded p-1 text-[#8b90a6] hover:text-red-400"
            aria-label="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-white/20 px-4 py-2 text-sm text-[#edeef3] hover:border-[#e8a33d]">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? "Uploading..." : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </label>

        <span className="text-xs text-[#8b90a6]">or paste a URL</span>
        <input
          type="text"
          placeholder="https://..."
          defaultValue={value && !uploading ? "" : ""}
          onBlur={(e) => {
            if (e.target.value) onChange(e.target.value);
          }}
          className="min-w-[180px] flex-1 rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-sm text-[#edeef3] outline-none focus:border-[#e8a33d]"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
