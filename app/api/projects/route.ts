import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Without both of these, Next.js caches the fetch that Supabase makes
// internally to reach the database, so the admin panel keeps showing
// stale data after you save changes even on a hard refresh.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, image_url, video_url, tags, link, sort_order } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      title,
      description: description ?? "",
      image_url: image_url ?? null,
      video_url: video_url ?? null,
      tags: tags ?? [],
      link: link ?? null,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}