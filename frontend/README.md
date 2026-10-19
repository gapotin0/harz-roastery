# ZHAROVNYA Roastery — Frontend

React + TypeScript + Vite application for the ZHAROVNYA Roastery website and admin panel.

See the [root README](../README.md) for the full project overview, environment
variables and security notes.

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Type-check and build for production      |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run Oxlint                               |

## Configuration

- `VITE_API_URL` — backend base URL (see `.env.example`, defaults to `http://localhost:3001`).
- Firebase web configuration: `src/services/firebase.ts` (public client config).
