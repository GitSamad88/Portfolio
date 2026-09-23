import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Without both of these, Next.js caches the fetch that Supabase makes
// internally to reach the database, so the admin panel keeps showing
// stale data after you save changes even on a hard refresh.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("site_content").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const {
    hero_name,
    hero_role,
    hero_tagline,
    hero_photo_url,
    about_text,
    about_photo_url,
    skills,
    resume_url,
    contact_email,
    contact_socials,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("site_content")
    .update({
      hero_name,
      hero_role,
      hero_tagline,
      hero_photo_url,
      about_text,
      about_photo_url,
      skills,
      resume_url,
      contact_email,
      contact_socials,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}