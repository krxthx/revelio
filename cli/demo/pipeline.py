"""Orchestrates chunking → embedding → projection → JSON output."""

import json
from pathlib import Path

from sentence_transformers import SentenceTransformer

from .chunking import chunk_text
from .embedding import embed, EMBEDDING_MODEL
from .projection import project, normalize

QUERIES_FILE = Path(__file__).parent.parent.parent / "data" / "queries.json"
OUTPUT_DIR = Path(__file__).parent.parent.parent / "ui" / "public" / "data"


def prepare_corpus(
    corpus_name: str,
    input_path: Path,
    model: SentenceTransformer,
    output_dir: Path = OUTPUT_DIR,
) -> Path:
    """
    Full pipeline for one corpus:
      1. Read raw text
      2. Chunk
      3. Embed chunks + queries
      4. UMAP project + normalise
      5. Write JSON to output_dir/{corpus_name}.json

    Returns the output path.
    """
    print(f"\n[{corpus_name}] Reading {input_path}")
    raw_text = input_path.read_text(encoding="utf-8")

    print(f"[{corpus_name}] Chunking…")
    texts = chunk_text(raw_text)
    print(f"[{corpus_name}] {len(texts)} chunks")

    print(f"[{corpus_name}] Embedding chunks…")
    chunk_embeddings = embed(texts, model)

    print(f"[{corpus_name}] Running UMAP…")
    coords = normalize(project(chunk_embeddings))

    chunks = [
        {
            "id": f"{corpus_name}-chunk-{i:04d}",
            "text": text,
            "embedding": emb.tolist(),
            "x": float(coord[0]),
            "y": float(coord[1]),
            "z": float(coord[2]),
        }
        for i, (text, emb, coord) in enumerate(zip(texts, chunk_embeddings, coords))
    ]

    print(f"[{corpus_name}] Loading queries…")
    all_queries = json.loads(QUERIES_FILE.read_text(encoding="utf-8"))
    raw_queries = all_queries[corpus_name]
    query_texts = [q["text"] for q in raw_queries]

    print(f"[{corpus_name}] Embedding queries…")
    query_embeddings = embed(query_texts, model, show_progress=False)

    queries = [
        {"id": q["id"], "text": q["text"], "embedding": emb.tolist()}
        for q, emb in zip(raw_queries, query_embeddings)
    ]

    output = {
        "corpus": corpus_name,
        "model": EMBEDDING_MODEL,
        "chunks": chunks,
        "queries": queries,
    }

    output_dir.mkdir(parents=True, exist_ok=True)
    out_path = output_dir / f"{corpus_name}.json"
    out_path.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")

    size_kb = out_path.stat().st_size / 1024
    print(f"[{corpus_name}] Wrote {out_path} ({size_kb:.0f} KB, {len(chunks)} chunks)")
    return out_path
