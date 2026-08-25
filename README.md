# GYMORA 🏋️

**GYMORA** is a bilingual fitness planning and workout-tracking web app that creates personalized training plans based on the user’s goal, training location, experience level, weekly schedule, available equipment, session duration, muscle focus, and training profile.

🌐 **Live Demo:** https://gymora-video-preview.vercel.app

## Highlights

- Arabic and English support with RTL/LTR layouts.
- Personalized Home / Gym workout plans.
- Goal-aware programming for muscle gain, fat loss, strength, and general fitness.
- Training profile selection with exercise-priority differences for male/female plans while keeping programming balanced.
- Muscle-focus programming for chest, back, legs, upper body, and glutes/lower body.
- Recovery-aware weekly splits so the same priority area is not trained hard on consecutive days.
- Dynamic session size: 45-minute sessions use 5 exercises, with longer sessions scaling up.
- Exercise selection respects available equipment and training location.
- Exercise swaps without rebuilding the entire plan.
- Exercise guides for every exercise with an embedded technique video plus quick form cues.
- Sequential Workout Player: complete one exercise at a time, log sets/reps/weight, then move to the next exercise until the session is finished.
- Expanded lower-body and glute exercise library including Hip Thrusts, Romanian Deadlifts, Bulgarian Split Squats, Step-ups, Kickbacks, Hip Abduction, Goblet Squats, and Glute Bridges.
- Sets, reps, weight, PRs, rest timer, XP, levels, streaks, and achievements.
- Nutrition planner with an expanded food library and availability/preferences filters.
- Supabase authentication and cloud sync with local-first fallback.
- Friend system, leaderboard foundation, and online challenge support.
- Responsive mobile-first UI and PWA assets.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Supabase (Auth + Database + RLS)
- Vercel (deployment)
- PWA / Service Worker

## Training Logic

GYMORA does not use one generic routine for every user. The plan generator changes the weekly split, exercise pool, volume, repetition ranges, rest times, and exercise count based on the profile.

Examples:
- **Muscle gain + Upper Body focus + 4 days:** Upper Push → Lower → Upper Pull → Lower.
- **Leg focus + 3 days:** Legs A → Upper Body → Legs B.
- **45-minute session:** 5 exercises.
- **Home training:** only exercises compatible with the user’s available equipment are selected.
- **Lower-body sessions:** include glute-focused movements, with stronger lower-body priority when the profile/focus calls for it.

## Workout Experience

When a workout starts, GYMORA presents the session exercise-by-exercise rather than showing a dense form for the entire workout at once. The user can review technique and an embedded exercise video, record the performed weight and repetitions for each set, and use Previous/Next navigation until the session is complete.

## Nutrition Planner

The nutrition section provides general fitness-oriented estimates and builds meals from foods the user marks as available. The food library includes protein sources, carbohydrates, healthy fats, fruits, and vegetables.

Nutrition values are approximate and are not a substitute for medical or dietetic advice.

## Backend Setup

A browser-safe Supabase configuration template is included in `supabase-config.js`.

1. Create a Supabase project.
2. Run `supabase-schema.sql`.
3. Add your Project URL and **Publishable Key** to `supabase-config.js`.
4. Never place a `service_role` key or other secret in frontend files.

More details are available in `BACKEND_SETUP.md`.

## Project Status

**Public Beta** — currently being tested with real users and iterated based on feedback.

---

Built and maintained as an independent web product project.
