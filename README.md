# Revelio

An interactive RAG (Retrieval-Augmented Generation) explorer that visualizes text embeddings in 3D space and lets you see how semantic search works under the hood.

## What it shows

- **3D embedding space** - document chunks visualized using UMAP projection. Semantically similar chunks cluster together.
- **Semantic retrieval** - select a query, watch the most relevant chunks highlight in real time.
- **Retrieval modes** - toggle between Cosine and MMR to compare how retrieval strategy changes results.
- **Prompt assembly** - see exactly how retrieved chunks get assembled into the LLM prompt.
- **Streamed answer** - the LLM generates a response grounded in the retrieved context.
- **Word embeddings** - switch to the "Word Embeddings" corpus to explore how ~2000 common English words cluster by meaning.

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
            ├── retrieval.ts   # Cosine similarity + MMR (client-side)
            └── llm/           # OpenAI-compatible LLM adapter
```

## Setup

### 1. Generate corpus data (Python)

```bash
cd cli
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Generate all corpora
python -m demo --all

# Or a single corpus
python -m demo --corpus alice
```

Default embedding model: `all-MiniLM-L6-v2` (text corpora), `BAAI/bge-base-en-v1.5` (words).

Output is written to `ui/public/data/{corpus}.json`.

### 2. Configure the LLM

The UI calls any OpenAI-compatible API. Create `ui/.env.local`:

```bash
LLM_BASE_URL=https://openrouter.ai/api/v1   # or http://localhost:11434/v1 for Ollama
LLM_MODEL=qwen/qwen-2.5-7b-instruct
LLM_API_KEY=your_api_key
```

You can also switch providers at runtime from the settings menu in the UI.

### 3. Run the UI

```bash
cd ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Recommended models

Smaller instruction-following models tend to work better for RAG than large RLHF-trained ones - they follow the system prompt more faithfully and avoid over-hedging when context is provided.

| Model | Via | Notes |
|---|---|---|
| `qwen/qwen-2.5-7b-instruct` | OpenRouter (free) | Best free option - concise, direct answers |
| `meta-llama/llama-3.1-8b-instruct` | OpenRouter | Solid, widely supported |
| `mistralai/mistral-7b-instruct:free` | OpenRouter (free) | Good baseline |
| `qwen2.5:7b` | Ollama (local) | Same model, runs fully offline |

## Retrieval modes

**Cosine similarity** - ranks all chunks by vector similarity to the query and returns the top K. Fast and straightforward. Can return redundant results if the document has repeated content.

**MMR (Maximal Marginal Relevance)** - picks chunks that are both relevant to the query *and* different from each other. After selecting the first chunk (highest similarity), each subsequent pick is penalized if it's too similar to an already-selected chunk. Useful when you want broader topic coverage. Configured with λ=0.5 (equal weight to relevance and diversity).

In practice: cosine is the default in most RAG systems. MMR is worth trying when your top results all cover the same passage.

Both modes apply a similarity threshold of 0.3 - chunks below this score are excluded regardless of K.

## A note on the 3D visualization

The embedding space uses UMAP to project 384-dimensional vectors down to 3D for display. UMAP is lossy - nearby points in 3D are genuinely semantically related, but exact distances aren't preserved. **Retrieval runs on the full 384-dim embeddings**, not the projected coordinates. The 3D view is for building intuition, not for retrieval.

## Corpora

| ID | Label | Description |
|----|-------|-------------|
| `alice` | Alice in Wonderland | Classic novel - loose semantic clusters by theme and character |
| `fastapi` | FastAPI Docs | Framework documentation - tight clusters by feature area |
| `space` | Space Exploration | Factual text - broad topic spread, mixed density |
| `words` | Word Embeddings | ~2000 common English words |

## Tech stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **3D visualization**: Three.js, React Three Fiber, Drei
- **Embeddings**: sentence-transformers (Python)
- **Dimensionality reduction**: UMAP (3D projection)
- **LLM backend**: Any OpenAI-compatible API (OpenRouter, Ollama, LM Studio, vLLM)
- **Retrieval**: Client-side cosine similarity and MMR

## Future ideas

- **Phase 2 CLI** - ingest your own documents and run RAG on them locally
- **Chunking visualizer** - compare fixed-size vs sentence vs semantic chunking side by side
- **BM25 vs semantic** - keyword vs embedding retrieval comparison
- **Token visualizer** - see how text and images get tokenized across different models
