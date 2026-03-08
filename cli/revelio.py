"""Revelio CLI — index a local folder into a custom corpus for the UI.

Usage:
    python revelio.py index ./path/to/folder --name "My Project"

Run from the cli/ directory so that demo.chunking / demo.projection are importable.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

from demo.chunking import chunk_text
from demo.projection import normalize, project
from extract import SUPPORTED_EXTENSIONS, extract_text

MODEL_NAME = "all-MiniLM-L6-v2"
# Path to the UI public/data/custom directory, relative to this file.
DEFAULT_OUTPUT_RELATIVE = "../ui/public/data/custom"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(name: str) -> str:
    """Convert a human-readable name to a URL-safe slug.

    Examples:
        "My Project"     -> "my-project"
        "Alice Extended" -> "alice-extended"
    """
    slug = name.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def resolve_output_dir(override: str | None) -> Path:
    if override:
        return Path(override).expanduser().resolve()
    return (Path(__file__).parent / DEFAULT_OUTPUT_RELATIVE).resolve()


def collect_files(folder: Path) -> list[Path]:
    """Walk *folder* recursively, returning all supported files sorted by path."""
    supported: list[Path] = []
    for path in sorted(folder.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() in SUPPORTED_EXTENSIONS:
            supported.append(path)
        else:
            print(f"  Skipping unsupported file: {path.relative_to(folder)}", file=sys.stderr)
    return supported


# ---------------------------------------------------------------------------
# Core indexing logic
# ---------------------------------------------------------------------------

def build_corpus(folder: Path, name: str, output_dir: Path) -> None:
    slug = slugify(name)
    files = collect_files(folder)

    if not files:
        print("No supported files found in folder.", file=sys.stderr)
        sys.exit(1)

    print(f"Indexing {len(files)} file(s) as '{name}' ({slug})…")

    # 1. Extract text and chunk
    raw_chunks: list[dict[str, str]] = []
    for file_path in files:
        text = extract_text(file_path)
        if not text.strip():
            continue
        for chunk in chunk_text(text):
            raw_chunks.append({"source": file_path.name, "text": chunk})

    if not raw_chunks:
        print("No text could be extracted from any file.", file=sys.stderr)
        sys.exit(1)

    print(f"  {len(raw_chunks)} chunk(s) — embedding with {MODEL_NAME}…")

    # 2. Embed
    model = SentenceTransformer(MODEL_NAME)
    texts = [c["text"] for c in raw_chunks]
    embeddings: np.ndarray = model.encode(
        texts, show_progress_bar=True, convert_to_numpy=True
    )

    # 3. Project to 3D
    print("  Projecting to 3D with UMAP…")
    coords = normalize(project(embeddings))

    # 4. Assemble corpus JSON
    chunks_out = [
        {
            "id": f"{slug}-chunk-{i:04d}",
            "text": chunk["text"],
            "source": chunk["source"],
            "embedding": emb.tolist(),
            "x": float(coord[0]),
            "y": float(coord[1]),
            "z": float(coord[2]),
        }
        for i, (chunk, emb, coord) in enumerate(zip(raw_chunks, embeddings, coords))
    ]

    corpus_data = {
        "corpus": slug,
        "label": name,
        "model": MODEL_NAME,
        "chunks": chunks_out,
        "queries": [],
    }

    # 5. Write corpus file
    output_dir.mkdir(parents=True, exist_ok=True)
    corpus_file = output_dir / f"{slug}.json"
    corpus_file.write_text(
        json.dumps(corpus_data, ensure_ascii=False), encoding="utf-8"
    )
    print(f"  Saved corpus: {corpus_file}")

    # 6. Upsert manifest
    _upsert_manifest(output_dir, slug, name)

    print(f"\nDone! Corpus '{name}' is ready.")
    print("Restart the dev server (npm run dev) to see it in the UI.")


def _upsert_manifest(output_dir: Path, slug: str, label: str) -> None:
    manifest_file = output_dir / "manifest.json"
    if manifest_file.exists():
        manifest: dict = json.loads(manifest_file.read_text(encoding="utf-8"))
    else:
        manifest = {"projects": []}

    # Remove existing entry with same id, then append updated entry
    manifest["projects"] = [p for p in manifest["projects"] if p["id"] != slug]
    manifest["projects"].append({"id": slug, "label": label, "file": f"{slug}.json"})

    manifest_file.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"  Updated manifest: {manifest_file}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="revelio",
        description="Revelio — visualise document embeddings in 3D",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    index_cmd = sub.add_parser(
        "index",
        help="Index a folder of documents into a custom corpus",
    )
    index_cmd.add_argument("folder", type=Path, help="Path to the document folder")
    index_cmd.add_argument(
        "--name", required=True, metavar="NAME",
        help='Human-readable project name, e.g. "My Docs"',
    )
    index_cmd.add_argument(
        "--output", default=None, metavar="DIR",
        help="Override the output directory (default: ../ui/public/data/custom/)",
    )

    return parser


def main() -> None:
    args = _build_parser().parse_args()

    if args.command == "index":
        folder = args.folder.expanduser().resolve()
        if not folder.is_dir():
            print(f"Error: '{folder}' is not a directory.", file=sys.stderr)
            sys.exit(1)
        build_corpus(folder, args.name, resolve_output_dir(args.output))


if __name__ == "__main__":
    main()
