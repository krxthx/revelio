# Phase 1 — Hosted Demo: Subtasks

## Overview

Phase 1 ships a fully static hosted RAG visualization demo on Vercel. All embeddings (chunks + queries) and UMAP 3D coordinates are pre-computed offline. At runtime: the user clicks a pre-baked query, cosine similarity runs live in the browser, matched chunks animate in the 3D visualization, the prompt assembles, and the LLM streams an answer via OpenRouter. No embedding model runs at query time.

---

## Track A — Data Pipeline (do first, unblocks everything)

### A1. Define embedding JSON schema

Define the data contract that the frontend consumes and that the Phase 2 CLI will also export to. This is the single most important design decision — nothing gets built without this.

```ts
// ui/public/data/{corpus-name}.json
{
  "corpus": "alice-in-wonderland",
  "model": "all-MiniLM-L6-v2",           // embedding model used — must match at query time
  "chunks": [
    {
      "id": "string",
      "text": "string",                   // raw chunk text shown in UI
      "embedding": [number],              // 384-dim vector
      "x": number,                        // UMAP 3D x
      "y": number,                        // UMAP 3D y
      "z": number                         // UMAP 3D z
    }
  ],
  "queries": [
    {
      "id": "string",
      "text": "string",                   // question shown in UI
      "embedding": [number],              // 384-dim vector — pre-computed
      "top_chunks": ["chunk_id", ...]     // NOT stored — computed live via cosine similarity
    }
  ]
}
```

Note: `top_chunks` is intentionally excluded from the schema — retrieval happens live at click time using cosine similarity, not from a pre-stored list.

**Done when:** Schema is documented and agreed on.

---

### A2. Select and prepare demo corpora

Pick 3 corpora that show interesting, contrasting retrieval patterns in the embedding space.

| Corpus | Source | Why |
|---|---|---|
| Alice in Wonderland | Project Gutenberg (public domain) | Narrative — loose semantic clustering by theme/character |
| Technical docs | Popular OSS README (e.g. FastAPI, Tailwind) | Precise — tight clusters by feature area |
| Wikipedia articles | A topic set (e.g. space exploration, ~5–10 articles) | Factual — mixed density, interesting spread |

Write 10 example queries per corpus. Choose queries that demonstrate a range: clear matches, subtle semantic matches, and near-misses.

**Done when:** Raw text files are in `scripts/raw/` and 30 example queries are written.

---

### A3. Write one-time data preparation script

A local Python script (`scripts/prepare_data.py`) that:
1. Reads raw text from `scripts/raw/`
2. Splits into chunks (fixed-size, ~300 tokens, with ~50 token overlap)
3. Generates chunk embeddings via `sentence-transformers` (`all-MiniLM-L6-v2`)
4. Generates query embeddings for the 10 example questions
5. Runs UMAP on chunk embeddings to get 3D coordinates (`n_components=3`)
6. Outputs one `{corpus}.json` per corpus to `ui/public/data/`

```bash
python scripts/prepare_data.py --corpus alice --input scripts/raw/alice.txt
python scripts/prepare_data.py --corpus fastapi --input scripts/raw/fastapi-docs.md
python scripts/prepare_data.py --corpus space --input scripts/raw/space/
```

**Done when:** `ui/public/data/*.json` files are generated and match the A1 schema.

---

## Track B — Project Setup

### B1. Next.js app scaffolding

- Confirm folder structure: `ui/src/app`, `ui/src/components`, `ui/src/lib`
- Configure Tailwind CSS
- Add `ui/public/data/` with generated JSONs from Track A
- Set up `vercel.json`
- Confirm `npm run dev` works from `ui/`

**Done when:** App loads at localhost with no errors.

---

### B2. OpenRouter API route

- Add `ui/.env.local` with `OPENROUTER_API_KEY`
- Add `ui/.env.example` (no real key)
- Create `ui/src/app/api/chat/route.ts` — receives assembled prompt, proxies to OpenRouter, streams response back
- Test with a hardcoded prompt via `curl`

**Done when:** `curl` to `/api/chat` returns a streamed LLM response.

---

## Track C — Visualization

### C1. Set up R3F canvas and scene

- Install `@react-three/fiber` and `@react-three/drei`
- Create `<EmbeddingSpace />` component with a basic R3F canvas
- Load corpus JSON at startup
- Render each chunk as a small sphere at its `(x, y, z)` UMAP 3D coordinates
- `OrbitControls` from drei — mouse drag to rotate, scroll to zoom, right-drag to pan
- Perspective camera with a sensible default position and FOV
- Coordinate system centered at origin (normalize UMAP coords to fit scene bounds)

**Done when:** Spheres render in 3D space, orbit controls feel smooth, and the full point cloud is visible on load.

---

### C2. Chunk hover + tooltip

- On hover, highlight the point and show a tooltip with the chunk's text
- Tooltip should be readable without cluttering the scene

**Done when:** Hovering a point shows its text.

---

### C3. Retrieval highlight animation

- Accept a list of "retrieved chunk IDs" as a prop
- Animate matched chunks: scale up, color change, glow/pulse
- Non-matched chunks dim
- Smooth transition (~300–500ms)

**Done when:** Passing a set of IDs causes a clear, smooth visual change.

---

## Track D — Chat + Retrieval

### D1. Load corpus data

- Create `lib/corpus.ts` — loads the selected corpus JSON at startup
- Expose `chunks` (with embeddings) and `queries` (with embeddings) to the rest of the app
- Handle loading state

**Done when:** Corpus data is available in the app after page load.

---

### D2. Cosine similarity retrieval

- Create `lib/retrieval.ts`
- Implement `cosineSimilarity(a: number[], b: number[]): number`
- Implement `retrieve(queryEmbedding: number[], chunks: Chunk[], topK: number): Chunk[]`
- No library — plain TypeScript math, runs entirely in the browser

```ts
function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
  return dot / (magA * magB)
}
```

**Done when:** `retrieve(queryEmbedding, chunks, 5)` returns the correct top-5 chunks.

---

### D3. Query selector + retrieval flow

Wire up the full pipeline:
1. User clicks one of the 10 example queries
2. Its pre-computed embedding is loaded from the corpus JSON
3. `retrieve(queryEmbedding, chunks, topK)` runs live → top-K chunks
4. Visualization updates to highlight matched chunks (calls C3)
5. Retrieved chunks passed to prompt builder (D4)

**Done when:** Clicking a query causes the correct chunks to highlight in the viz.

---

### D4. Prompt builder panel

- Collapsible side panel: "How the prompt was built"
- Shows assembled prompt: system message + retrieved chunk texts + query
- Animates chunks appearing as they assemble
- Token count if feasible

**Done when:** Panel updates in real time when a query is clicked.

---

### D5. LLM streaming + answer display

- Call `/api/chat` (B2) with the assembled prompt
- Stream response incrementally in the chat UI
- Keep retrieved chunks highlighted in the viz while streaming
- After streaming: show "Sources" — the chunk texts used

**Done when:** Full end-to-end: click query → retrieval → viz highlight → prompt build → streamed answer.

---

## Track E — UX Polish

### E1. Corpus selector

- Tab switcher or dropdown for the 3 corpora
- Switching corpus reloads the embedding space
- Clears current query/answer state

**Done when:** User can switch corpora and the viz updates.

---

### E2. Loading + error states

- Corpus JSON loading: spinner while fetching
- OpenRouter errors: friendly message in chat (rate limit, network failure)
- No query selected: prompt the user to pick one

**Done when:** All failure paths show a clear, non-broken UI.

---

### E3. Mobile + responsive layout

- Viz takes full width on mobile
- Chat panel stacks below viz on small screens
- Prompt builder hidden by default on mobile (toggle to show)

**Done when:** App is usable on a phone-sized viewport.

---

## Dependency Order

```
A1 (schema)
    ↓
A2 (raw text + queries) → A3 (generate JSONs)
                                ↓
B1 (scaffold) ──────────→ C1 (needs data)
B2 (API route) ──────────────────────────→ D5

D1 (load data) → D2 (cosine sim) → D3 (query flow) → D4 (prompt builder) → D5
                                        ↓
                                       C3 (highlight animation)
```

Start with **A1**, then **A2 + A3** and **B1** in parallel. Everything else follows.

---

## Definition of Done — Phase 1

- [ ] Embedding space renders with pre-computed chunks for 3 corpora
- [ ] User clicks a query → live cosine similarity → correct chunks highlight in viz
- [ ] Prompt builder panel shows assembled prompt
- [ ] LLM streams an answer via OpenRouter
- [ ] Source chunks stay highlighted during streaming
- [ ] App deployed and publicly accessible on Vercel
- [ ] No API keys exposed to the client
- [ ] Works on mobile
