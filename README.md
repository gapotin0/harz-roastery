# HARZ Roastery

HARZ Roastery is a full-stack website for a specialty coffee roastery: a bilingual
(English / Ukrainian) storefront with a coffee shop, a barista and roaster academy,
custom roasting requests and an admin panel for managing the whole catalogue.

The project consists of a React single-page application and an Express API that
stores data in Firestore, uploads product images to Firebase Storage,
translates admin content with DeepL and sends new request notifications to Telegram.

## Features

**Website**

- Responsive landing page with roast profiles and audience sections
- Coffee shop catalogue with category filters, sorting and pagination
- Cart and checkout (order totals are calculated on the server)
- Coffee academy with course enrollment
- Custom roasting request form
- English / Ukrainian interface and light / dark theme

**Admin panel** (`/admin`)

- Sign-in with Firebase Authentication
- Dashboard with products, orders, courses, enrollments and roasting requests
- Product management with image cropping and Firebase Storage uploads
- Course management with active / inactive state
- Order, course enrollment and custom roasting request status management
- Ukrainian → English translation of courses and product descriptions via DeepL
- Telegram notifications about new orders, course enrollments and roasting requests

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Emotion CSS
- React Router
- Firebase Web SDK (Authentication)

**Backend**

- Node.js
- Express
- TypeScript
- Firebase Admin SDK

**Services**

- Firestore
- Firebase Authentication
- Firebase Storage
- DeepL API
- Telegram Bot API

## Project Structure

```text
harz_rostery/
├── frontend/                 React + Vite application
│   ├── public/images/        Static images (favicon, placeholders)
│   └── src/
│       ├── admin/            Admin panel pages and components
│       ├── assets/           Images and icons used by components
│       ├── components/       Public website sections, cart and checkout
│       ├── data/             Shared types and initial seed data
│       └── services/         API clients and Firebase initialisation
│
└── backend/                  Express API
    └── src/
        ├── config/           Firebase Admin setup
        ├── controllers/      Request validation and responses
        ├── middleware/       Admin authentication
        ├── routes/           API routes
        ├── services/         Firestore, image storage, DeepL and Telegram logic
        └── types/            Shared backend types
```

## Local Development

Requirements: **Node.js 22.12+** (required by Firebase Admin SDK and Vite) and npm.

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env` (see [Environment Variables](#environment-variables)) and place the
Firebase service account JSON at the path set in `GOOGLE_APPLICATION_CREDENTIALS`
(by default `backend/secrets/firebase-service-account.json`). Then start the API:

```bash
npm run dev
```

The API runs on `http://localhost:3001` by default (`GET /api/health` returns `{ "status": "ok" }`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The website runs on `http://localhost:5173`, the admin panel on `http://localhost:5173/admin`.

The Firebase web configuration lives in `frontend/src/services/firebase.ts`. It is
public client configuration, not a secret; replace it with your own Firebase project
values when running a fork.

## Environment Variables

Only variable **names** are listed here. Real values belong in local `.env` files,
which are ignored by Git.

**Backend** (`backend/.env`, template: `backend/.env.example`)

| Variable                         | Description                                                  |
| -------------------------------- | ------------------------------------------------------------ |
| `PORT`                           | API port (default `3001`)                                    |
| `FRONTEND_URL`                   | Allowed CORS origin (default `http://localhost:5173`)        |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the Firebase Admin service account JSON              |
| `FIREBASE_STORAGE_BUCKET`        | Firebase Storage bucket for product images                   |
| `ADMIN_UID`                      | Firebase Auth UIDs allowed to use the admin API, comma-separated. A user with the custom claim `admin: true` is also allowed (`npm run set-admin -- <uid>` in `backend`) |
| `DEEPL_API_KEY`                  | DeepL API key                                                |
| `TELEGRAM_BOT_TOKEN`             | Telegram bot token for notifications                         |
| `TELEGRAM_RECIPIENT_IDS`         | Comma-separated Telegram user ids that receive notifications |

**Frontend** (`frontend/.env`, template: `frontend/.env.example`)

| Variable       | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `VITE_API_URL` | Backend base URL (optional, default `http://localhost:3001`)  |

## API Overview

| Endpoint                     | Public | Admin only                                       |
| ---------------------------- | ------ | ------------------------------------------------ |
| `/api/products`              | `GET`  | `POST`, `POST /reset`, `PUT /:id`, `DELETE /:id` |
| `/api/courses`               | `GET`  | `POST`, `PUT /:id`, `DELETE /:id`                |
| `/api/orders`                | `POST` | `GET`, `PATCH /:id/status`, `POST /:id/notify`, `DELETE /:id` |
| `/api/course-enrollments`    | `POST` | `GET`, `PATCH /:id/status`, `POST /:id/notify`, `DELETE /:id` |
| `/api/custom-roasting`       | `POST` | `GET`, `PATCH /:id/status`, `POST /:id/notify`, `DELETE /:id` |
| `/api/uploads/product-image` | –      | `POST`                                           |
| `/api/translate/course`      | –      | `POST`                                           |
| `/api/translate/product`     | –      | `POST`                                           |

Firestore collections: `harz_products`, `harz_academy_courses`, `harz_orders`,
`harz_course_enrollments`, `harz_custom_roasting_requests`.

## Security

- Secret environment variables (`.env`) are not committed; only `.env.example`
  templates with placeholders are part of the repository.
- The Firebase Admin service account JSON is stored locally in `backend/secrets/`
  and is ignored by Git.
- Admin routes require a Firebase ID token (`Authorization: Bearer <token>`). The
  backend verifies the token with the Firebase Admin SDK and allows a user
  whose UID is listed in `ADMIN_UID` or who has the custom claim `admin: true`.
- DeepL and Telegram credentials are used only by the backend; the frontend never
  receives them.

## Build

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm run build
npm start
```

Lint (frontend):

```bash
cd frontend
npm run lint
```
