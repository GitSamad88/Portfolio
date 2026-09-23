# Your Portfolio

A portfolio site with a password-protected admin panel where you control every
piece of content — text, images, videos, theme colors/fonts, and your
projects list — without touching code after setup.

**Stack:** Next.js (frontend + backend API routes) · Supabase (database +
file storage) · Tailwind CSS. Free to run on Vercel's and Supabase's free
tiers.

---

## 1. Create your Supabase project (the database + storage)

1. Go to [supabase.com](https://supabase.com), sign up, and create a new project.
   Save the database password it gives you somewhere safe (you won't need it
   for this project directly, but keep it).
2. Once the project is ready, open **SQL Editor** in the left sidebar →
   **New query**.
3. Open `supabase/schema.sql` from this project, copy the whole file, paste
   it into the SQL editor, and click **Run**. This creates your three tables
   (site content, projects, theme) and a public storage bucket for your
   uploaded images/videos, pre-filled with a starting version of your bio.
4. Go to **Settings → API**. You'll need three values from this page in the
   next step:
   - **Project URL**
   - **anon public** key
   - **service_role** key (click "Reveal" — keep this one secret, never put
     it in frontend code or share it)

## 2. Set up the project locally

You'll need [Node.js](https://nodejs.org) (v18 or newer) installed.

```bash
# from inside the portfolio folder
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=          # your Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # your anon public key
SUPABASE_SERVICE_ROLE_KEY=         # your service_role key
```

Now generate your admin password. This never stores your real password
anywhere — only a one-way hash of it:

```bash
npm run hash-password
```

Type a password when prompted, then copy the printed line into `.env.local`:

```
ADMIN_PASSWORD_HASH=$2a$10$...
```

Finally, add one more random secret used to sign your login session. Generate
one at https://generate-secret.vercel.app/32 (or run
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
and add it:

```
JWT_SECRET=your-random-string
```

## 3. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to log in and start editing — add your real
photos, projects, bio, and pick a theme.

## 4. Deploy it for real (Vercel)

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), sign up (free), and click
   **Add New → Project**, then import your repository.
3. Before deploying, open **Environment Variables** and add the same five
   variables from your `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `ADMIN_PASSWORD_HASH`, `JWT_SECRET`).
4. Click **Deploy**. In a couple of minutes you'll have a live URL like
   `your-portfolio.vercel.app`. You can add a custom domain later from the
   Vercel project's **Domains** tab.

Any time you edit content from `/admin` on the live site, it updates
immediately — no redeploy needed. You only need to redeploy if you want to
change the actual code/design.

## How it's organized

```
app/
  page.tsx              → public homepage (reads from Supabase)
  admin/                → password-protected dashboard
  api/                  → backend routes (auth, content, projects, theme, upload)
components/
  site/                 → the public-facing sections (Hero, About, Projects...)
  admin/                → the editor UI (Content/Projects/Theme tabs)
lib/                    → Supabase clients, auth helpers, shared types
supabase/schema.sql     → your database structure — the source of truth
```

## Notes

- Two example projects are pre-loaded (based on your actual n8n/Kling AI
  work) so the Projects section isn't empty on first load — edit or delete
  them from `/admin` and add your real ones with images/videos.
- Your admin password is never stored in plain text — only its bcrypt hash,
  in `ADMIN_PASSWORD_HASH`.
- The `service_role` Supabase key is only ever used inside API routes on the
  server, never sent to the browser.
- Videos: paste a YouTube or Vimeo link and it will embed automatically, or
  upload a short video file directly (up to 50MB).
- Want to change your password later? Run `npm run hash-password` again and
  update `ADMIN_PASSWORD_HASH` (redeploy if you're changing it in Vercel).
