"""Text chunking utilities."""

import re

CHUNK_SIZE = 150     # target words per chunk
CHUNK_OVERLAP = 30   # overlap between consecutive chunks in words

SEPARATORS = ["\n\n", "\n", ".", " "]


def normalize_whitespace(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _word_count(text: str) -> int:
    return len(text.split())


def _split_by_separator(text: str, separator: str) -> list[str]:
    """Split text on separator, keeping the separator at the end of each piece."""
    if separator == " ":
        return text.split()
    parts = text.split(separator)
    # Re-attach the separator to preserve context (except for the last piece)
    result = []
    for i, part in enumerate(parts):
        if part:
            result.append(part + (separator if i < len(parts) - 1 else ""))
    return result


def _merge_chunks(splits: list[str], chunk_size: int, overlap: int) -> list[str]:
    """Merge a flat list of small splits into overlapping chunks of ~chunk_size words."""
    chunks: list[str] = []
    current_words: list[str] = []

    for split in splits:
        split_words = split.split()
        # If adding this split would exceed chunk_size, flush current chunk first
        if current_words and len(current_words) + len(split_words) > chunk_size:
            chunks.append(" ".join(current_words))
            # Keep trailing `overlap` words for the next chunk
            current_words = current_words[-overlap:] if overlap else []
        current_words.extend(split_words)

    if current_words:
        chunks.append(" ".join(current_words))

    return chunks


def _recursive_split(text: str, separators: list[str], chunk_size: int) -> list[str]:
    """
    Recursively split text using the separator list.  Try the first separator;
    any resulting piece that is still too large is split again with the next
    separator in the list.  Returns a flat list of pieces all <= chunk_size words.
    """
    if _word_count(text) <= chunk_size:
        return [text]

    sep = separators[0]
    remaining_seps = separators[1:]

    pieces = _split_by_separator(text, sep)

    result: list[str] = []
    for piece in pieces:
        if _word_count(piece) <= chunk_size:
            result.append(piece)
        elif remaining_seps:
            result.extend(_recursive_split(piece, remaining_seps, chunk_size))
        else:
            # No more separators — hard-split on words
            words = piece.split()
            for i in range(0, len(words), chunk_size):
                result.append(" ".join(words[i : i + chunk_size]))

    return result


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Split text into overlapping chunks using a recursive separator strategy.
    Splits prefer natural boundaries (paragraphs > lines > sentences > words)
    so dialogue and prose are not severed mid-scene.
    """
    text = normalize_whitespace(text)

    if _word_count(text) <= chunk_size:
        return [text]

    fine_splits = _recursive_split(text, SEPARATORS, chunk_size)
    return _merge_chunks(fine_splits, chunk_size, overlap)
