"""
Entry point: python -m cli.demo [--corpus CORPUS | --all]

Generates pre-computed corpus JSON files for the hosted demo.
"""

import argparse
from pathlib import Path

from .embedding import load_model, DEFAULT_MODEL as SENTENCE_DEFAULT
from .pipeline import prepare_corpus
from .words_pipeline import generate_words_corpus, DEFAULT_MODEL as WORDS_DEFAULT

RAW_DIR = Path(__file__).parent.parent.parent / "data" / "raw"

CORPUS_INPUTS: dict[str, Path] = {
    "alice":   RAW_DIR / "alice.txt",
    "fastapi": RAW_DIR / "fastapi.md",
    "space":   RAW_DIR / "space" / "space.txt",
}

CORPUS_DEFAULT_MODELS: dict[str, str] = {
    "alice":   SENTENCE_DEFAULT,
    "fastapi": SENTENCE_DEFAULT,
    "space":   SENTENCE_DEFAULT,
    "words":   WORDS_DEFAULT,
}

ALL_CORPORA = list(CORPUS_INPUTS) + ["words"]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate pre-computed corpus JSON files for the Revelio demo."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--corpus", choices=ALL_CORPORA, help="Single corpus to process")
    group.add_argument("--all", action="store_true", help="Process all corpora")
    parser.add_argument("--model", default=None, help="Override embedding model for all corpora")
    args = parser.parse_args()

    corpora = ALL_CORPORA if args.all else [args.corpus]

    for name in corpora:
        model_name = args.model or CORPUS_DEFAULT_MODELS[name]
        print(f"\n[{name}] Using model: {model_name}")
        model = load_model(model_name)
        if name == "words":
            generate_words_corpus(model_name)
        else:
            prepare_corpus(name, CORPUS_INPUTS[name], model, model_name)

    print("\nDone.")


if __name__ == "__main__":
    main()
