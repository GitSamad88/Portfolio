"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#12141f] px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-white/10 bg-[#1b1e2e] p-8">
        <h1 className="mb-1 font-semibold text-[#edeef3] text-xl">Admin login</h1>
        <p className="mb-6 text-sm text-[#8b90a6]">Enter your password to manage your portfolio.</p>

        <label className="mb-1 block text-sm text-[#8b90a6]" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-white/10 bg-[#12141f] px-3 py-2 text-[#edeef3] outline-none focus:border-[#e8a33d]"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-[#e8a33d] px-4 py-2 font-medium text-[#12141f] transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
