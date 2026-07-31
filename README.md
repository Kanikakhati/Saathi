# Saathi

A voice-first menopause companion app for India — helping women notice, understand, and act on symptoms in their own words, and connecting them to verified doctors or ASHA/ANM workers.

Built for the Commudle Girls Hack Day (8 Aug 2026).

## Project status

- **Frontend** — done. React + Tailwind, all 8 screens built (landing, auth, onboarding, dashboard, check-in, report, doctor finder, family share).
- **Backend** — in progress (separate teammate). Not yet connected — all data on the frontend is currently mocked/hardcoded.

## Tech stack

- React + Vite
- Tailwind CSS
- react-router-dom
- chart.js / react-chartjs-2 (dashboard charts)

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Folder structure

```
src/
├── components/    Nav, AppNav, Waveform, Icons — shared across pages
├── pages/         One component per screen, routed with react-router-dom
├── App.jsx        Route definitions
├── main.jsx       Entry point
└── index.css      Tailwind directives + custom keyframes/component classes
```

### Screens

| Route          | Screen                              |
|-----------------|--------------------------------------|
| `/`             | Landing page                        |
| `/auth`         | Sign up / log in (phone + OTP)      |
| `/onboarding`   | New user setup                      |
| `/dashboard`    | Home (voice/text check-in, charts)  |
| `/checkin`      | Conversation screen                 |
| `/report`       | Symptom summary                     |
| `/doctor`       | Verified doctor / ASHA finder       |
| `/family`       | Shareable family card               |

## Design tokens

Colors and fonts are defined once in `tailwind.config.js` (`wine`, `cream`, `rose`, `plum`, etc.) — change them there and they apply across every screen.

## Backend integration (upcoming)

Currently all data (user info, MRS score, doctor list, chat replies) is hardcoded in the page components for demo purposes. Once the backend API is ready, these will be replaced with real `fetch` calls. No environment variables or API keys are needed yet — this repo will need a `.env` file (already excluded via `.gitignore`) once real API endpoints exist.

## Contributing

1. Create a branch off `main` for your change
2. Commit and push your branch
3. Open a pull request into `main`
