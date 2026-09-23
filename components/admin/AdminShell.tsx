"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import ContentEditor from "./ContentEditor";
import ProjectsEditor from "./ProjectsEditor";
import ThemeEditor from "./ThemeEditor";

const TABS = [
  { key: "content", label: "Content" },
  { key: "projects", label: "Projects" },
  { key: "theme", label: "Theme" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AdminShell() {
  const [tab, setTab] = useState<TabKey>("content");
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0f1119]">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-[#edeef3]">Portfolio admin</span>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  tab === t.key ? "bg-[#e8a33d] text-[#12141f]" : "text-[#8b90a6] hover:text-[#edeef3]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="flex items-center gap-1 text-sm text-[#8b90a6] hover:text-[#edeef3]">
            View site <ExternalLink size={14} />
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-[#8b90a6] hover:text-red-400">
            <LogOut size={14} /> Log out
          </button>
        </div>
      </header>

      <main className="px-6 py-10">
        {tab === "content" && <ContentEditor />}
        {tab === "projects" && <ProjectsEditor />}
        {tab === "theme" && <ThemeEditor />}
      </main>
    </div>
  );
}
