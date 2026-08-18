# Architecture

GYMORA is a static, browser-first application with optional cloud synchronization.

## Frontend
- HTML/CSS/Vanilla JavaScript UI.
- Local-first state stored in LocalStorage.
- Training engine generates workouts from goal, level, days, duration, place, equipment and focus.
- Nutrition engine builds meal suggestions from the user's available foods and preferences.
- PWA service worker provides static-asset caching.

## Cloud backend
Supabase provides:
- Email/password authentication.
- Private `user_states` persistence.
- Public-safe leaderboard profile data.
- Friend requests and online challenge records.
- Row Level Security for per-user data access.

## Production
The public beta is deployed on Vercel. Browser code never contains service-role keys or webhook secrets.
