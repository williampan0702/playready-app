# PlayReady

PlayReady is a dependency-free responsive web app prototype for a hackathon. It turns self-reported recovery signals into an explainable readiness score, multiple activity-specific workout options, and an interactive recovery scenario.

## Run it

Open `index.html` directly in a modern browser. No local server or installation is required.

## Architecture

- `index.html` — accessible page structure and product copy
- `styles.css` — responsive visual system
- `readiness.js` — pure scoring, classification, workout, and scenario functions
- `app.js` — form interaction, rendering, demo mode, and local history

The scoring engine is intentionally separated from the interface. Its rules can later be replaced by research-backed weights or a validated model without rebuilding the page.

## Product flow

- Pick one of three demo athletes or complete a personal check-in.
- See a transparent score breakdown and a concise morning summary.
- Choose a recommended, short, or recovery session.
- Explore how sleep, fatigue, and soreness change the modeled score.
- Record post-session duration, effort, and how the workout felt.
- Review readiness trends, common limiting factors, completion rate, and decline alerts.
- Safety guardrails pause workout guidance when concerning symptoms are reported.
- Start a chosen workout in a three-stage Workout Player with a timer, progress tracking, pause, and stage completion.
- Review a personalized seven-day training outline with daily effort targets.
- Complete a recovery action checklist generated from the strongest limiting signals.
- Inspect the model's maximum factor weights and prototype boundaries in a dedicated methodology section.

All prototype history is device-local and stored in the browser. It is suitable for the hackathon demo, not shared multi-device product data.

## Current prototype rules

- Sleep below 7 hours reduces readiness, with stronger penalties below 6 and 5 hours.
- Fatigue, soreness, and stress contribute transparent weighted penalties.
- A hard session on the previous day reduces readiness.
- Score bands: Ready 80–100, Moderate 60–79, Low 40–59, Recovery 0–39.

This prototype is a decision-support experience, not a medical assessment or injury-prediction system.
