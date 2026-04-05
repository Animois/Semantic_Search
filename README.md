# Semantic Programming Search (React + Tailwind)

Modern React web application with **User Panel** and **Admin Panel** for semantic programming search.

## Features

- Login / signup with role selection (`user` or `admin`).
- User panel with large semantic search box.
- Embedding generation using **GitHub Models** (with local fallback embedding when token is missing or request fails).
- Cosine similarity search over a local dataset file (`public/data/stackoverflow_3000.json`).
- Admin panel to add new question/answer records to the in-memory index.

## Dataset

The project includes a `dataset:refresh` script that attempts to fetch 3000 rows from:

`https://huggingface.co/datasets/MartinElMolon/stackoverflow_preguntas_con_embeddings`

If the endpoint is unavailable in your environment, the script safely generates a 3000-row fallback dataset so the app remains runnable.

## Run locally

```bash
npm install
npm run dev
```

## Optional environment variables

Create `.env`:

```bash
VITE_GITHUB_TOKEN=your_github_token
VITE_GITHUB_EMBEDDING_MODEL=text-embedding-3-small
```

With token set, embeddings are requested from `https://models.inference.ai.azure.com/embeddings`.

## Dataset refresh

```bash
npm run dataset:refresh
```
