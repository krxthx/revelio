export const DOCS_SECTIONS = [
  { href: "#embeddings", label: "What are embeddings?" },
  { href: "#semantic-search", label: "Semantic search" },
  { href: "#retrieval-modes", label: "Retrieval modes" },
  { href: "#rag", label: "Retrieval-Augmented Generation" },
  { href: "#chunking", label: "Chunking" },
  { href: "#umap", label: "Dimensionality reduction & UMAP" },
  { href: "#pipeline", label: "How the Revelio pipeline works" },
  { href: "#custom-corpora", label: "Custom data sources" },
  { href: "#models", label: "Recommended models" },
] as const;

export const CUSTOM_INDEX_VARIANTS = [
  [
    'python revelio.py index ./docs --name "My Project"',
    "Standard local indexing flow",
  ],
  [
    'python revelio.py index ~/Documents/notes --name "Personal Notes"',
    "Index a folder outside the repo using an absolute or home-relative path",
  ],
  [
    'python revelio.py index ./docs --name "My Project" --output ../ui/public/data/custom',
    "Override where the generated corpus and manifest are written",
  ],
] as const;

export const CUSTOM_INDEX_FLAGS = [
  ["folder", "Yes", "Root folder scanned recursively for supported files"],
  ["--name NAME", "Yes", "Human-readable project label shown in the UI"],
  ["--output DIR", "No", "Override the default output directory"],
] as const;

export const DEMO_GENERATION_VARIANTS = [
  [
    "python -m demo --all",
    "Regenerate every built-in corpus with the default model mapping",
  ],
  ["python -m demo --corpus alice", "Refresh one built-in text corpus"],
  ["python -m demo --corpus words", "Rebuild the word explorer only"],
  [
    "python -m demo --all --model BAAI/bge-base-en-v1.5",
    "Force one embedding model across the whole generated dataset",
  ],
  [
    "python -m demo --corpus fastapi --model BAAI/bge-base-en-v1.5",
    "Override the model for a single corpus run",
  ],
] as const;

export const DEMO_GENERATION_FLAGS = [
  [
    "--all",
    "One of `--all` or `--corpus`",
    "Generate every built-in corpus in one run",
  ],
  [
    "--corpus CORPUS",
    "One of `--all` or `--corpus`",
    "Generate exactly one corpus: `alice`, `fastapi`, `space`, or `words`",
  ],
  ["--model MODEL", "No", "Override the embedding model for the selected run"],
] as const;

export const RECOMMENDED_MODELS = [
  [
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "OpenRouter (free)",
    "Best free option - fast, follows instructions well",
  ],
  ["meta-llama/llama-3.1-8b-instruct", "OpenRouter", "Solid, widely supported"],
  ["mistral-small3.1", "Ollama (local)", "Runs fully offline"],
] as const;

export const OPENAI_COMPAT_FIELDS = [
  ["Base URL", "https://api.groq.com/openai/v1"],
  ["Model", "llama3-8b-8192"],
  ["API Key", "gsk_..."],
] as const;
