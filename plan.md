# RAG Explorer — Project Plan

## Overview

An interactive visualization tool that shows how Retrieval-Augmented Generation works — from embedding space to LLM answer generation. Built in phases: a hosted demo first, then a fully local CLI-powered version.

**Model philosophy:** Open-source models throughout. Embeddings always run locally (in-browser via Transformers.js, or via sentence-transformers in CLI mode). LLM calls go to OpenRouter (hosted demo) or Ollama (local mode).

---

## Phase 1 — Hosted Demo (Vercel)

**Goal:** A beautiful, interactive RAG visualization running in the browser with pre-computed embeddings. Core chat + visualization loop — this is the heart of the product and the foundation for Phase 2.

### What ships

- 2D/3D embedding space visualization (pre-computed, loaded at startup)
- Chat interface — user types a query, sees retrieval happen live
- Query embedding computed in-browser via **Transformers.js** (`all-MiniLM-L6-v2`) — no API key, no server round trip
- Nearest neighbor search against pre-computed chunk embeddings (cosine similarity, in-browser)
- Animated retrieval — matched chunks highlight and activate in the visualization
- Prompt construction view — shows exactly how retrieved chunks assemble into the final prompt
- LLM answer streamed via **OpenRouter** (free model, key stored in Vercel env vars)
- Source chunks stay highlighted while the answer streams
- Pre-curated dataset — 2-3 interesting corpora (e.g. a short novel excerpt, a technical README, a Wikipedia article set)

### Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Vercel-native, API routes for proxying OpenRouter |
| Visualization | Three.js or `@react-three/fiber` | 3D embedding space |
| Embeddings (browser) | Transformers.js — `all-MiniLM-L6-v2` | Fully local, ~22MB, no key needed |
| Vector search | Cosine similarity (in-browser) | Simple, instant, no infra |
| LLM | OpenRouter — `mistralai/mistral-7b-instruct` (free tier) | Simple API, free, open model |
| Deployment | Vercel | Zero config |

### Key UX flows

1. **Land on page** → embedding space already rendered with pre-computed chunks floating in 2D
2. **Type a query** → query embedding computed locally, nearest neighbors animate and highlight
3. **See prompt builder** → panel shows chunks assembling into the LLM prompt in real time
4. **Get answer** → LLM streams response via OpenRouter, source chunks stay highlighted throughout

### Deliverables

- `/app` — Next.js app
- `/data` — pre-computed embedding JSONs for demo corpora
- `vercel.json` — deployment config
- `README.md` — basic setup

---

## Phase 2 — CLI + Local Server

**Goal:** Users clone the repo, run a CLI to ingest their own documents, spin up a local server, and get the full RAG Explorer experience with their own data and their own models.

### What ships

- `rag-explorer` CLI (Python, using `typer`)
- Document ingestion — PDF, plain text, Markdown supported
- Chunking with configurable strategy (fixed-size, sentence-aware)
- Local embedding generation via **sentence-transformers** (`all-MiniLM-L6-v2` — same model as browser for consistency)
- UMAP projection to 2D/3D for visualization
- Embeddings + chunk metadata exported to a local JSON that the frontend reads
- FastAPI local server serving the embedding data + proxying LLM calls
- **Ollama** integration for local LLM — user points to `http://localhost:11434`, picks any model they have pulled
- Frontend detects local server and switches from demo mode to live mode automatically
- Settings panel in UI — user can configure base URL and model name

### CLI interface

```bash
# Ingest documents
rag-explorer ingest ./my-docs --chunk-size 512 --overlap 64

# Start visualization server
rag-explorer serve --port 8000

# Combo command
rag-explorer run ./my-docs
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

- `/cli` — Python package
- `pyproject.toml` — pip installable
- Updated frontend with mode detection (demo vs local)
- `docker-compose.yml` (optional) for Ollama + server together

---

## Phase 3 — GitHub Readiness + Cleanup

**Goal:** Make the repo something people want to star, clone, and contribute to.

### What ships

- Polished `README.md` with demo GIF, architecture diagram, quickstart
- `CONTRIBUTING.md`
- `ARCHITECTURE.md` — explains demo vs local mode split, data flow, model choices
- `.env.example` with all environment variable documentation
- GitHub Actions — lint + type-check on PR
- Issue templates — bug report, feature request
- MIT License
- UMAP projection tooltip — clear note in UI explaining 2D is a lossy projection, not the actual retrieval space
- Accessibility pass — keyboard navigation, color contrast
- Performance audit — bundle size, Transformers.js load time, lazy loading
- One-click "Deploy to Vercel" button in README

---

## Model Reference

| Use case | Model | Notes |
|---|---|---|
| Browser embeddings | `all-MiniLM-L6-v2` via Transformers.js | ~22MB, runs in-browser, no key |
| CLI embeddings | Same model via `sentence-transformers` | Consistent vector space with browser |
| Hosted demo LLM | OpenRouter — `mistralai/mistral-7b-instruct` | Free tier, key in Vercel env |
| Local LLM | Ollama — user's choice | Just a localhost API call |

---

## Priority Notes

Phase 1 chat + visualization is the core of the entire product. Phase 2 builds directly on top of Phase 1's frontend with no rewrites needed. Phase 3 is polish, not an afterthought.

The embedding model (`all-MiniLM-L6-v2`) is intentionally consistent across browser and CLI — same model, same vector space, so pre-computed demo embeddings and live local embeddings are directly comparable.