"""Embedding generation via sentence-transformers."""

import numpy as np
from sentence_transformers import SentenceTransformer

DEFAULT_MODEL = "all-MiniLM-L6-v2"
BATCH_SIZE = 64


def load_model(model_name: str = DEFAULT_MODEL) -> SentenceTransformer:
    return SentenceTransformer(model_name)


def embed(texts: list[str], model: SentenceTransformer, show_progress: bool = True) -> np.ndarray:
    """Return a numpy array of shape (N, dim)."""
    return model.encode(texts, show_progress_bar=show_progress, batch_size=BATCH_SIZE)
