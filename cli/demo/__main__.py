"""
Entry point: python -m cli.demo [--corpus CORPUS | --all]

Generates pre-computed corpus JSON files for the hosted demo.
"""

import argparse
from pathlib import Path

from .embedding import load_model, EMBEDDING_MODEL
from .pipeline import prepare_corpus

RAW_DIR = Path(__file__).parent.parent.parent / "data" / "raw"

CORPUS_INPUTS: dict[str, Path] = {
    "alice":   RAW_DIR / "alice.txt",
    "fastapi": RAW_DIR / "fastapi.md",
    "space":   RAW_DIR / "space" / "space.txt",
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate pre-computed corpus JSON files for the Revelio demo."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--corpus", choices=list(CORPUS_INPUTS), help="Single corpus to process")
    group.add_argument("--all", action="store_true", help="Process all corpora")
    args = parser.parse_args()

    corpora = list(CORPUS_INPUTS) if args.all else [args.corpus]

    print(f"Loading embedding model: {EMBEDDING_MODEL}")
    model = load_model()

    for name in corpora:
        prepare_corpus(name, CORPUS_INPUTS[name], model)

    print("\nDone.")


if __name__ == "__main__":
    main()
