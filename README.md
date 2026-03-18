<p align="center">
  <img src="ui/public/logo.png" alt="Revelio logo" width="96" />
</p>

# Revelio

Revelio is an interactive RAG explorer that makes retrieval visible.

Instead of treating semantic search and prompt assembly as a black box, Revelio lets you inspect the full flow: browse an embedding space in 3D, run retrieval against real corpora, inspect the exact context sent to the model, and watch the answer stream back.

It is useful for:

- learning how embeddings and retrieval actually behave
- demoing RAG to a team or client without hand-waving
- comparing retrieval strategies like cosine similarity vs. MMR
- indexing your own docs and exploring them with the same UI

## Product Overview

Revelio combines three things in one experience:

- **A 3D embedding map** that helps you see how semantically related chunks cluster
- **A retrieval workbench** for queries, chunk ranking, similarity thresholds, and retrieval mode comparison
- **A grounded answer view** that shows the exact prompt context behind each model response

Built-in corpora are already checked into the repo, so you can run the app immediately without generating data first.

## Current Model Stack

Revelio now uses a single embedding family across the full retrieval pipeline:

- **Built-in text corpora embeddings:** `BAAI/bge-base-en-v1.5`
- **Client-side query embedding in the browser:** `BAAI/bge-base-en-v1.5`
- **Word explorer embeddings:** `BAAI/bge-base-en-v1.5`
- **Custom document indexing:** `BAAI/bge-base-en-v1.5`
- **Default hosted chat model:** `mistralai/mistral-small-3.1-24b-instruct:free`
- **OpenAI-compatible preset in the UI:** `meta-llama/llama-3.1-8b-instruct`
- **Local prompt-model example:** `gemma2:9b`

Using `bge-base-en-v1.5` everywhere keeps chunk embeddings, query embeddings, and custom corpora in the same semantic space. On the generation side, the app works with any OpenAI-compatible model endpoint, including local Gemma via Ollama.

## What You Can Do

- Explore built-in corpora for `Alice in Wonderland`, `FastAPI Docs`, `Space Exploration`, and `Word Embeddings`
- Switch between cosine similarity and MMR retrieval
- Adjust top-K retrieval and inspect the retrieved passages
- Compare word neighborhoods in the dedicated word-embedding corpus
- Use any OpenAI-compatible model endpoint for answer generation
- Index your own local documents and load them into the UI as custom projects

## Quick Start

### 1. Configure an LLM

Copy the example env file and point it at any OpenAI-compatible `/v1/chat/completions` endpoint:

```bash
cd ui
cp .env.example .env.local
```

Example providers:

```bash
# Ollama
LLM_BASE_URL=http://localhost:11434/v1
LLM_MODEL=gemma2:9b
LLM_API_KEY=ollama
```

```bash
# OpenRouter
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_MODEL=mistralai/mistral-small-3.1-24b-instruct:free
LLM_API_KEY=your_key
```

```bash
# OpenAI-compatible preset
LLM_BASE_URL=http://localhost:1234/v1
LLM_MODEL=meta-llama/llama-3.1-8b-instruct
LLM_API_KEY=local-dev-key
```

You can also override the endpoint and model from the settings menu in the app.

### 2. Run the UI

```bash
cd ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then go to `/demo`.

## Bring Your Own Documents

Revelio includes a CLI for turning a local folder into a custom corpus that shows up in the app.

```bash
cd cli
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python revelio.py index ./path/to/docs --name "My Project"
```

### Custom Indexing Command Reference

The custom indexing CLI currently exposes one command with two flags:

```bash
python revelio.py index <folder> --name "<project name>" [--output <dir>]
```

Variants:

```bash
# Required minimal form
python revelio.py index ./docs --name "My Project"
```

```bash
# Any folder path works: relative, absolute, or with ~
python revelio.py index ~/Documents/notes --name "Personal Notes"
```

Flags:

| Flag | Required | What it does |
|---|---|---|
| `folder` | Yes | Root folder to scan recursively for supported files |
| `--name NAME` | Yes | Human-readable label shown in the UI |
| `--output DIR` | No | Override the output directory for the corpus JSON and manifest |

What the command does:

1. Extracts text from supported files recursively
2. Chunks and embeds the extracted text
3. Projects the embeddings into 3D with UMAP
4. Writes a corpus JSON file to `ui/public/data/custom/`
5. Updates `ui/public/data/custom/manifest.json`

Supported file types:

- `.txt`
- `.md`
- `.pdf`
- `.jpg`
- `.jpeg`
- `.png`
- `.gif`
- `.webp`

Notes:

- PDF extraction uses `pypdf`
- OCR uses `pytesseract` and `Pillow`
- OCR also requires the `tesseract` system binary, for example `brew install tesseract`

After indexing, restart `npm run dev` if the app is already running.

## Regenerate Built-In Corpora

You only need this if you want to refresh the checked-in demo data or change embedding models.

```bash
cd cli
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# generate every built-in corpus
python -m demo --all

# or generate one corpus
python -m demo --corpus alice
```

### Built-In Corpus Generation Command Reference

The demo corpus generator supports every combination below:

```bash
python -m demo --all [--model <embedding-model>]
python -m demo --corpus <alice|fastapi|space|words> [--model <embedding-model>]
```

Variants:

```bash
# Generate every built-in corpus with the default configured models
python -m demo --all
```

```bash
# Regenerate a single corpus
python -m demo --corpus alice
```

```bash
# Regenerate the word explorer only
python -m demo --corpus words
```

```bash
# Force the same embedding model across every generated corpus
python -m demo --all --model BAAI/bge-base-en-v1.5
```

```bash
# Override the embedding model for one corpus run
python -m demo --corpus fastapi --model BAAI/bge-base-en-v1.5
```

Flags:

| Flag | Required | What it does |
|---|---|---|
| `--all` | One of `--all` or `--corpus` | Generates every built-in corpus in one run |
| `--corpus CORPUS` | One of `--all` or `--corpus` | Generates one corpus: `alice`, `fastapi`, `space`, or `words` |
| `--model MODEL` | No | Overrides the default embedding model for the selected run |

Generated files are written to `ui/public/data/{corpus}.json`.

Default corpus-generation models:

- Built-in text corpora: `BAAI/bge-base-en-v1.5`
- Word corpus: `BAAI/bge-base-en-v1.5`
- Custom indexed corpora via `revelio.py`: `BAAI/bge-base-en-v1.5`

## How It Works

At a high level, Revelio follows this pipeline:

1. Source text is chunked and embedded
2. Embeddings are projected into 3D for visualization
3. Queries are embedded client-side with `BAAI/bge-base-en-v1.5` and matched against the full embedding vectors
4. Retrieved chunks are assembled into a strict grounded RAG prompt
5. The answer is streamed from an OpenAI-compatible model endpoint

Important detail: retrieval does **not** use the 3D coordinates. The 3D map is only a visualization of the higher-dimensional embedding space.

## Built-In Corpora

| ID | Label | Best for |
|---|---|---|
| `alice` | Alice in Wonderland | narrative retrieval and quote-grounded answers |
| `fastapi` | FastAPI Docs | documentation-style semantic search |
| `space` | Space Exploration | broad factual topics with varied density |
| `words` | Word Embeddings | nearest-neighbor exploration without document QA |

## Repo Structure

```text
revelio/
├── cli/        # corpus generation and custom indexing
├── data/       # raw source texts and predefined queries
└── ui/         # Next.js app, 3D visualization, chat, settings
```

## Tech Stack

- Next.js, React, TypeScript, Tailwind CSS
- Three.js with React Three Fiber
- sentence-transformers for embedding generation
- UMAP for 3D projection
- OpenAI-compatible chat backends for answer generation
- Client-side cosine similarity and MMR retrieval
