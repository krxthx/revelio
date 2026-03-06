"""Text chunking utilities."""

import re

CHUNK_SIZE = 300     # target words per chunk
CHUNK_OVERLAP = 50   # overlap between consecutive chunks in words


def normalize_whitespace(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Split text into overlapping word-level chunks.
    Each chunk targets `chunk_size` words; consecutive chunks overlap by
    `overlap` words so context is preserved at boundaries.
    """
    text = normalize_whitespace(text)
    words = text.split()

    if len(words) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        if end == len(words):
            break
        start += chunk_size - overlap

    return chunks
