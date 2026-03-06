# Revelio

An interactive RAG (Retrieval-Augmented Generation) explorer that visualizes text embeddings in 3D space and lets you see how semantic search works under the hood.

## What it does

- **Explore embedding space** — view text chunks or words as points in a 3D scatter plot, color-coded by semantic similarity
- **Run semantic search** — select a pre-built query and watch the top-K nearest chunks highlight in the visualization
- **See the full RAG pipeline** — inspect the retrieved context, the constructed prompt, and stream a live LLM answer
- **Browse word embeddings** — switch to the "Word Embeddings" corpus to explore how ~2000 common English words cluster by meaning, and find nearest neighbors for any word

## Architecture

```
revelio/
├── cli/            # Python pipeline: chunk → embed → UMAP → JSON
│   └── demo/
│       ├── chunking.py        # Text splitting
│       ├── embedding.py       # sentence-transformers inference
│       ├── projection.py      # UMAP 3D projection + normalization
│       ├── pipeline.py        # Orchestrates full corpus pipeline
│       └── words_pipeline.py  # Word embedding corpus generator
└── ui/             # Next.js frontend
    └── src/
        ├── app/
        │   ├── page.tsx           # Main app
        │   └── api/chat/route.ts  # Streaming LLM endpoint
        ├── components/
        │   ├── embedding-space.tsx  # 3D canvas (React Three Fiber)
        │   ├── query-selector.tsx   # Pre-built query list
        │   ├── word-browser.tsx     # Word search/browse panel
        │   ├── similar-words.tsx    # Nearest neighbor display
        │   ├── prompt-builder.tsx   # Shows constructed RAG prompt
        │   └── answer-panel.tsx     # Streams LLM answer
        └── lib/
            ├── corpus.ts      # Corpus loading + types
            ├── retrieval.ts   # Cosine similarity search (client-side)
            └── llm/           # OpenAI-compatible LLM adapter
```

## Available corpora

| ID | Label | Description |
|----|-------|-------------|
| `alice` | Alice in Wonderland | Classic novel chunks |
| `fastapi` | FastAPI Docs | Framework documentation |
| `space` | Space Exploration | Space-related text |
| `words` | Word Embeddings | ~2000 common English words |

## Setup

### 1. Generate corpus data (Python)

```bash
cd cli
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Generate a single corpus
python -m demo --corpus alice

# Generate all corpora
python -m demo --all

# Use a custom embedding model
python -m demo --corpus fastapi --model sentence-transformers/all-mpnet-base-v2
```

Default models:
- Text corpora: `all-MiniLM-L6-v2`
- Word embeddings: `BAAI/bge-base-en-v1.5`

Output is written to `ui/public/data/{corpus}.json`.

### 2. Configure the LLM

The UI calls any OpenAI-compatible API. Create `ui/.env.local`:

```bash
LLM_BASE_URL=https://openrouter.ai/api/v1   # or http://localhost:11434/v1 for Ollama
LLM_MODEL=mistralai/mistral-7b-instruct:free
LLM_API_KEY=your_api_key
```

Defaults to [OpenRouter](https://openrouter.ai) with `mistralai/mistral-7b-instruct:free` (free tier, no key required).

### 3. Run the UI

```bash
cd ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **3D visualization**: Three.js, React Three Fiber, Drei
- **Embeddings**: sentence-transformers (Python)
- **Dimensionality reduction**: UMAP (3D projection)
- **LLM backend**: Any OpenAI-compatible API (OpenRouter, Ollama, etc.)
- **Retrieval**: Client-side cosine similarity search
