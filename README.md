# White Lotus API

Express API for the White Lotus property site. It stores residences, buyer inquiries, and a sales-desk admin account in PostgreSQL, and serves JSON under `/api`.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- [PostgreSQL](https://www.postgresql.org/) 14 or newer, running locally
- npm (included with Node.js)

## Setup

From this `backend` folder:

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate`, so the Prisma client is created as part of install.

### 2. Configure environment variables

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://white_lotus:white_lotus_dev@localhost:5432/white_lotus?schema=public` |
| `JWT_SECRET` | Signs admin session tokens. Must be at least 16 characters | placeholder in `.env.example` |
| `PORT` | HTTP port | `4000` |
| `CLIENT_ORIGIN` | Allowed browser origin for CORS (the Vite frontend) | `http://localhost:5173` |

Replace `JWT_SECRET` with a long random string before you use this anywhere other than your own machine. `.env` is gitignored.

### 3. Create the database

The sample `DATABASE_URL` expects a role named `white_lotus` and a database named `white_lotus`. In `psql` as a superuser:

```sql
CREATE USER white_lotus WITH PASSWORD 'white_lotus_dev';
CREATE DATABASE white_lotus OWNER white_lotus;
```

If you use a different user, password, host, or database name, put that connection string in `DATABASE_URL` instead.

### 4. Apply migrations

```bash
npm run db:migrate
```

This runs `prisma migrate dev` and creates the `Admin`, `Property`, and `Inquiry` tables.

### 5. Load sample data

```bash
npm run db:seed
```

The seed replaces existing properties and inquiries, then upserts the sales-desk admin:

- Email: `admin@whitelotus.local`
- Password: `LotusAdmin#2026`

It also inserts eight sample residences and three inquiries.

### 6. Start the server

Development (restarts when files change):

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API listens on `http://localhost:4000` unless `PORT` is set. Check it with:

```bash
curl http://localhost:4000/api/health
```

A healthy process returns `{ "ok": true }`.

## Scripts

| Script | Command |
| --- | --- |
| `npm run dev` | Start with `node --watch` |
| `npm start` | Start once |
| `npm run db:migrate` | Apply Prisma migrations in development |
| `npm run db:seed` | Load the sample admin, residences, and inquiries |

## API

Public:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/properties` | List residences |
| `GET` | `/api/properties/meta` | Filter metadata |
| `GET` | `/api/properties/:id` | One residence |
| `POST` | `/api/inquiries` | Submit a buyer inquiry |
| `POST` | `/api/auth/login` | Admin sign-in. Body: `{ "email", "password" }` |

Admin (cookie `token`, or `Authorization: Bearer <token>`):

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/logout` | Clear the session cookie |
| `GET` | `/api/auth/me` | Current admin |
| `GET` | `/api/admin/properties` | List residences for the desk |
| `POST` | `/api/admin/properties` | Create a residence |
| `PUT` | `/api/admin/properties/:id` | Update a residence |
| `DELETE` | `/api/admin/properties/:id` | Delete a residence |
| `GET` | `/api/admin/inquiries` | List inquiries |

Login sets an httpOnly cookie named `token` (7 days). CORS allows `CLIENT_ORIGIN` with credentials.

If `../frontend/dist` exists next to this folder (that is, `White_Lotus/frontend/dist`), the same process also serves that built frontend.

## Project layout

```
src/index.js          server entry
src/env.js            required environment variables
src/routes/           auth, properties, inquiries, admin
src/controllers/      request handlers
prisma/schema.prisma  database models
prisma/seed.js        sample data
```
