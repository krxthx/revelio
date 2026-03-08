"""
Generate the 'words' corpus: individual English words embedded and projected to 3D.

Each word is embedded as "word (category)" so the model has enough semantic context
for accurate retrieval — bare single words are ambiguous (e.g. "python", "light").

Usage:
    python -m cli.demo.words_pipeline

Output: ui/public/data/words.json
"""

import json
from pathlib import Path

import numpy as np
from umap import UMAP

from .embedding import embed, load_model
from .projection import normalize
from .words_data import WORD_CATEGORIES

DEFAULT_MODEL = "BAAI/bge-base-en-v1.5"
OUTPUT_PATH = Path(__file__).parent.parent.parent / "ui" / "public" / "data" / "words.json"


def _build_entries() -> list[tuple[str, str]]:
    """Return (text_for_embedding, category) pairs, deduplicated by word."""
    seen: set[str] = set()
    entries: list[tuple[str, str]] = []
    for category, words in WORD_CATEGORIES.items():
        for word in words:
            key = word.lower().strip()
            if key not in seen:
                seen.add(key)
                entries.append((key, category))
    return entries


def generate_words_corpus(model_name: str = DEFAULT_MODEL) -> None:
    entries = _build_entries()
    print(f"[words] {len(entries)} unique words across {len(WORD_CATEGORIES)} categories")
    print(f"[words] Loading model: {model_name}")
    model = load_model(model_name)

    # Embed bare words — adding "(category)" forces same-category words to be nearly identical
    # vectors, creating tight blobs. Bare words preserve fine-grained semantic differences.
    texts = [word for word, _ in entries]

    print("[words] Embedding…")
    embeddings = embed(texts, model)

    print("[words] UMAP projection…")
    # min_dist=0.99 (max) + low n_neighbors → uniform galaxy scatter, no category blobs
    reducer = UMAP(
        n_components=3,
        n_neighbors=5,
        min_dist=0.99,
        spread=2.0,
        metric="cosine",
        random_state=42,
    )
    coords = normalize(reducer.fit_transform(embeddings))

    chunks = [
        {
            "id": f"words-{i:04d}",
            "text": word,          # display label — just the word
            "source": category,    # category shown in the UI sidebar
            "embedding": emb.tolist(),
            "x": float(coord[0]),
            "y": float(coord[1]),
            "z": float(coord[2]),
        }
        for i, ((word, category), emb, coord) in enumerate(zip(entries, embeddings, coords))
    ]

    output = {
        "corpus": "words",
        "label": "Words",
        "model": model_name,
        "chunks": chunks,
        "queries": [],
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"[words] Wrote {OUTPUT_PATH} ({size_kb:.0f} KB, {len(chunks)} words)")


if __name__ == "__main__":
    generate_words_corpus()
