# PlayReady

PlayReady is a dependency-free responsive web app that turns self-reported recovery signals into an explainable readiness score and an actionable daily training recommendation.

## Live product flow

1. Complete a short check-in covering activity, available time, sleep, fatigue, soreness, stress, recent training load, and safety symptoms.
2. Review a transparent readiness score, factor breakdown, and a clear explanation of what the score changed.
3. Use the What-if controls to explore how recovery signals affect the modeled score.
4. Choose a recommended, shortened, or recovery-focused session.
5. Run the session through a three-stage workout player with a timer and progress controls.
6. Record actual duration and perceived effort to calibrate later target-effort recommendations.
7. Review a readiness-adjusted session for today and tentative training intentions for the next six days.
8. Choose realistic recovery actions, record a post-action reflection, and save it for future trends.
9. Review readiness history, limiting factors, training load, completion data, and personal effort calibration in the Dashboard.

## Architecture

- `index.html` — accessible page structure, forms, navigation, and product copy
- `styles.css` — responsive layout, visual system, transitions, and mobile behavior
- `readiness.js` — pure readiness scoring, classification, and workout-generation rules
- `app.js` — routing, form interaction, rendering, workout controls, recovery flow, feedback calibration, and local history
- `playready-icon.svg` and `favicon.ico` — browser-tab icons with modern and fallback formats

The scoring engine is separated from the interface so its rules can be replaced by research-backed weights or a validated model without rebuilding the product experience.

## Run locally

Open `index.html` directly in a modern browser. No server, installation, account, or external dependency is required.

## Data storage

Check-ins, completed sessions, and recovery reflections are stored locally in the browser using `localStorage`. The current version does not sync data between browsers or devices.

## Current scoring rules

- The score begins at 100.
- Sleep below 7 hours reduces readiness, with larger deductions below 6 and 5 hours.
- Fatigue, soreness, and stress contribute transparent weighted deductions.
- A hard session on the previous day adds a recent-load deduction.
- Score bands are Ready (80–100), Moderate (60–79), Low (40–59), and Recovery (0–39).
- Concerning symptoms pause workout guidance regardless of the numerical score.

## Product boundary

PlayReady is a training decision-support prototype. It is not a medical assessment, diagnosis, or injury-prediction system.
