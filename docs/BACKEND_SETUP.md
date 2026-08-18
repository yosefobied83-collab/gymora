# GYMORA V3 — Supabase Backend Setup

## 1) Create a Supabase project
Create a project in Supabase.

## 2) Run the database schema
In Supabase Dashboard → **SQL Editor** → New query, paste all of:

`supabase-schema.sql`

Run it once.

This creates:
- `profiles` — leaderboard-safe public profile stats for signed-in users.
- `user_states` — the user's complete GYMORA state (private via RLS).
- `friendships` — friend requests and accepted friendships.
- `online_challenges` — real 1v1 friend challenges.
- Auth trigger to automatically create profile/state rows.
- RLS policies.

## 3) Copy your browser-safe credentials
Supabase Dashboard → **Settings → API Keys** (or Connect dialog):
- Project URL
- **Publishable Key** (`sb_publishable_...`)

Open `supabase-config.js` and paste them:

```js
window.GYMORA_SUPABASE = {
  url: "https://YOUR_PROJECT.supabase.co",
  publishableKey: "sb_publishable_..."
};
```

**Never** put a Secret Key / service_role key in this project. This is browser code.

## 4) Auth settings
Supabase Dashboard → Authentication:
- Email/password provider should be enabled.
- For the fastest test, you can temporarily disable email confirmation.
- For production, email confirmation is recommended.
- Add your deployed Vercel URL under URL Configuration / Redirect URLs for password reset links.

## 5) Test cloud sync
Run locally with a web server (not only `file://`):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

Then:
1. Click **Cloud / دخول**.
2. Create an account.
3. Create/edit a workout plan.
4. Complete a workout.
5. Refresh or sign in on another browser/device.
6. The state should load from `user_states`.

## 6) Deploy on Vercel
This is still a static site; no build step is required.
- Upload to GitHub.
- Import repo in Vercel.
- Framework: Other.
- Build command: empty.
- Output directory: empty/root.

## Current V3 behavior
- If Supabase is not configured: GYMORA continues in Local mode.
- If configured but signed out: Local mode.
- If signed in: Local-first + debounced Cloud Sync.
- Real cloud leaderboard uses `profiles` ordered by XP.

## Social features
The UI already supports user search, friend requests, acceptance, and real 1v1 challenges when Supabase is connected.

## Nutrition sync
Nutrition preferences and generated plans are stored inside the private `user_states.state` JSON and sync automatically with the rest of the account. No extra nutrition table is required.
