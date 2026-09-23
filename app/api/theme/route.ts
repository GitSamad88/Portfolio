import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Without both of these, Next.js caches the fetch that Supabase makes
// internally to reach the database, so the admin panel keeps showing
// stale data after you save changes even on a hard refresh.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("theme_settings").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const {
    color_bg,
    color_surface,
    color_primary,
    color_secondary,
    color_text,
    color_muted,
    font_display,
    font_body,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("theme_settings")
    .update({
      color_bg,
      color_surface,
      color_primary,
      color_secondary,
      color_text,
      color_muted,
      font_display,
      font_body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}