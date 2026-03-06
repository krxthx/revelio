# RAG Explorer — Project Plan

## Overview

An interactive visualization tool that shows how Retrieval-Augmented Generation works — from embedding space to LLM answer generation. Built in phases: a hosted demo first, then a fully local CLI-powered version.

**What RAG is:** Retrieval-Augmented Generation is a pattern, not a library. When a user asks a question, the query is turned into a vector (embedding), matched against a set of pre-embedded document chunks using cosine similarity, and the top-K matching chunks are injected into an LLM prompt to generate a grounded answer. This app implements RAG from scratch — no LangChain, no LlamaIndex — so every step is explicit and visible.

**Phase philosophy:** Phase 1 is a fully static hosted demo — no runtime model calls, everything pre-computed. Phase 2 unlocks free-text queries and user-provided documents via a local CLI + model server.

---

## Phase 1 — Hosted Demo (Vercel)

**Goal:** A beautiful, interactive RAG visualization running in the browser. All embeddings are pre-computed — chunk embeddings, query embeddings, and UMAP coordinates. The retrieval, visualization, prompt assembly, and LLM answer happen live.

### What ships

- 3D embedding space visualization (pre-computed UMAP coords, loaded at startup)
- 3 demo corpora — narrative fiction, technical docs, factual/encyclopedic
- 10 pre-baked example queries per corpus (user clicks, no free-text input)
- Live cosine similarity retrieval — pure TypeScript, no library, runs in-browser
- Animated retrieval — matched chunks highlight and activate in the visualization
- Prompt construction view — shows exactly how retrieved chunks assemble into the final prompt
- LLM answer streamed via **OpenRouter** (free model, key stored in Vercel env vars)
- Source chunks stay highlighted while the answer streams

### Data (fully pre-computed, stored as static JSON)

All of the following are computed offline via a one-time Python script and checked into the repo:

- Chunk embeddings (`all-MiniLM-L6-v2` via `sentence-transformers`)
- UMAP 3D coordinates for each chunk (`n_components=3`)
- Query embeddings for the 10 example questions per corpus

Stored in `ui/public/data/` — served as static assets from Vercel's CDN.

### Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Vercel-native, API routes for proxying LLM calls |
| Visualization | `@react-three/fiber` + `@react-three/drei` | 3D embedding space in React |
| Embeddings | Pre-computed — no runtime model | Fully static, zero dependencies at query time |
| Vector search | Cosine similarity — plain TypeScript | Transparent, no library, runs in-browser |
| LLM | OpenRouter — `mistralai/mistral-7b-instruct` (free tier) | Simple API, free, open model |
| Deployment | Vercel | Zero config |

### Key UX flows

1. **Land on page** → embedding space renders with pre-computed chunks floating in 3D
2. **Click a query** → pre-computed query embedding runs cosine similarity live → top-K chunks animate and highlight
3. **See prompt builder** → panel shows chunks assembling into the LLM prompt in real time
4. **Get answer** → LLM streams response via OpenRouter, source chunks stay highlighted throughout

### Deliverables

- `ui/` — Next.js app
- `ui/public/data/` — pre-computed JSON files for each corpus
- `scripts/` — one-time Python data preparation script
- `vercel.json` — deployment config
- `README.md` — basic setup

---

## Phase 2 — CLI + Local Server

**Goal:** Users clone the repo, run a CLI to ingest their own documents, spin up a local server, and get the full RAG Explorer experience with their own data and their own models. Free-text queries are enabled here.

### What ships

- `rag-explorer` CLI (Python, using `typer`)
- Document ingestion — PDF, plain text, Markdown supported
- Chunking with configurable strategy (fixed-size, sentence-aware)
- Local embedding generation via **sentence-transformers** — model configured via env var
- UMAP projection to 3D for visualization (`n_components=3`)
- Embeddings + chunk metadata + UMAP coords exported to JSON (same schema as Phase 1)
- FastAPI local server serving the embedding data + proxying LLM calls
- **Ollama** integration for local LLM
- Free-text query input — query is embedded at runtime using the configured embedding endpoint
- Frontend detects local server and switches from demo mode to live mode automatically
- Settings panel in UI — configure embedding base URL, embedding model, LLM base URL, LLM model

### Embedding model consistency

The model name used during ingestion is stored inside `chunks.json`. At query time, the frontend warns if the configured model doesn't match — using different models for ingestion and queries produces meaningless retrieval results since the vectors live in different spaces.

### CLI interface

```bash
# Ingest documents
rag-explorer ingest ./my-docs --chunk-size 512 --overlap 64

# Start visualization server
rag-explorer serve --port 8000

# Combo command
rag-explorer run ./my-docs
```

### Environment config

```bash
EMBEDDING_BASE_URL=http://localhost:11434   # Ollama or any OpenAI-compatible endpoint
EMBEDDING_MODEL=all-minilm                  # must match what was used during ingestion
LLM_BASE_URL=http://localhost:11434
LLM_MODEL=mistral
```

### Tech stack additions

| Layer | Choice |
|---|---|
| CLI | Python + `typer` |
| Embeddings (local) | `sentence-transformers` |
| Dimensionality reduction | `umap-learn` |
| Local LLM | Ollama — any model (`mistral`, `llama3`, `phi3`, etc.) |
| Local server | FastAPI |
| Doc parsing | `pypdf`, `markdown-it-py` |

### Deliverables

- `cli/` — Python package
- `cli/pyproject.toml` — pip installable
- Updated frontend with mode detection (demo vs local) and settings panel
- `docker-compose.yml` (optional) for Ollama + server together

---

## Phase 3 — GitHub Readiness + Cleanup

**Goal:** Make the repo something people want to star, clone, and contribute to.

### What ships

- Polished `README.md` with demo GIF, architecture diagram, quickstart
- `CONTRIBUTING.md`
- `ARCHITECTURE.md` — explains demo vs local mode split, data flow, the RAG pipeline
- `.env.example` with all environment variable documentation
- GitHub Actions — lint + type-check on PR
- Issue templates — bug report, feature request
- MIT License
- UMAP projection tooltip — clear note in UI explaining 3D is a lossy projection for visualization only, not the actual retrieval space (retrieval uses full 384-dim cosine similarity)
- Accessibility pass — keyboard navigation, color contrast
- Performance audit — bundle size, lazy loading
- One-click "Deploy to Vercel" button in README

---

## Demo Corpora

| Corpus | Type | Why it's interesting |
|---|---|---|
| Alice in Wonderland | Narrative fiction | Loose, semantic retrieval — chunks cluster by theme/character |
| A popular OSS README / docs | Technical | Precise, keyword-heavy — tight clusters by feature area |
| Wikipedia article set (e.g. space exploration) | Factual/encyclopedic | Mixed — shows how factual density affects embedding spread |

10 hand-picked example queries per corpus, chosen to demonstrate interesting retrieval patterns (both strong matches and edge cases).

---

## Repo Structure

```
revelio/
├── ui/                   # Next.js app (Phase 1 frontend, deployed to Vercel)
│   └── public/data/      # Pre-computed JSON files (chunks, embeddings, UMAP coords)
├── cli/                  # Python CLI + FastAPI local server (Phase 2)
├── scripts/              # One-time data preparation scripts (chunk, embed, project)
├── plans/                # Project planning docs
└── .gitignore
```

---

## Priority Notes

Phase 1 chat + visualization is the core of the entire product. Phase 2 builds directly on top of Phase 1's frontend with no rewrites needed — the data schema is identical, the UI just gains a free-text input and a settings panel. Phase 3 is polish, not an afterthought.

The RAG pipeline is implemented from scratch (plain cosine similarity, no framework) so every step is transparent and visualizable. That's the point of the tool.
