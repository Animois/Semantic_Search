# Semantic Programming Search

A React-based semantic programming search web app with **User Panel** and **Admin Panel**.

## Why this version works immediately

This project now runs as a **standalone single-page app** directly from `index.html` using CDN-delivered React/Tailwind/Babel, so you can see the UI without requiring `npm install`.

## Features

- Login / signup with role selection (`user`, `admin`).
- User panel with large programming-question search input.
- Search text is converted to embeddings using GitHub Models when a token is provided (`window.GITHUB_MODELS_TOKEN`), otherwise deterministic local fallback embeddings are used.
- Cosine similarity ranking against `public/data/stackoverflow_3000.json` (3000 records).
- Admin panel to add new records into the running search index.

## Run

### Option 1 (recommended): local static server

```bash
python -m http.server 8000
```

Then open: `http://localhost:8000`

### Option 2: Vite workflow (optional)

```bash
npm install
npm run dev
```

## Dataset

Dataset source requested:

`https://huggingface.co/datasets/MartinElMolon/stackoverflow_preguntas_con_embeddings`

Refresh script (fetches from HF when possible, otherwise generates fallback rows):

```bash
node scripts/fetchDataset.mjs
```

Output file:

`public/data/stackoverflow_3000.json`
