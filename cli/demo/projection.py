"""UMAP 3D projection and coordinate normalisation."""

import numpy as np
from umap import UMAP

N_COMPONENTS = 3
N_NEIGHBORS = 15
MIN_DIST = 0.1
METRIC = "cosine"
RANDOM_STATE = 42

COORD_RANGE = (-5.0, 5.0)   # output coordinate space fed to Three.js


def project(embeddings: np.ndarray) -> np.ndarray:
    """Project embeddings to 3D via UMAP. Returns (N, 3) array."""
    reducer = UMAP(
        n_components=N_COMPONENTS,
        n_neighbors=min(N_NEIGHBORS, len(embeddings) - 1),
        min_dist=MIN_DIST,
        metric=METRIC,
        random_state=RANDOM_STATE,
    )
    return reducer.fit_transform(embeddings)


def normalize(coords: np.ndarray, low: float = COORD_RANGE[0], high: float = COORD_RANGE[1]) -> np.ndarray:
    """Scale each axis to [low, high]."""
    min_vals = coords.min(axis=0)
    max_vals = coords.max(axis=0)
    ranges = np.where(max_vals - min_vals > 0, max_vals - min_vals, 1.0)
    unit = (coords - min_vals) / ranges          # [0, 1]
    return unit * (high - low) + low             # [low, high]
