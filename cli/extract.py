"""Text extraction for supported file types.

Each extractor returns a plain string; empty string means nothing was extracted.
Unsupported extensions return "" so callers can skip silently.
Optional dependencies (pypdf, pytesseract/Pillow) are imported lazily so the
module works without them — a warning is printed for each affected file.
"""

from __future__ import annotations

import sys
from pathlib import Path

SUPPORTED_EXTENSIONS: frozenset[str] = frozenset(
    {".txt", ".md", ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"}
)


def extract_text(path: Path) -> str:
    """Return plain text from *path*, or "" for unsupported/unreadable files."""
    match path.suffix.lower():
        case ".txt" | ".md":
            return path.read_text(encoding="utf-8", errors="replace")
        case ".pdf":
            return _extract_pdf(path)
        case ext if ext in {".jpg", ".jpeg", ".png", ".gif", ".webp"}:
            return _extract_image(path)
        case _:
            return ""


# ---------------------------------------------------------------------------
# Per-type helpers
# ---------------------------------------------------------------------------

def _extract_pdf(path: Path) -> str:
    try:
        import pypdf
    except ImportError:
        print(
            f"Warning: 'pypdf' is not installed — skipping {path.name}. "
            "Install it with: pip install pypdf",
            file=sys.stderr,
        )
        return ""

    reader = pypdf.PdfReader(str(path))
    pages = (page.extract_text() or "" for page in reader.pages)
    return "\n\n".join(pages)


def _extract_image(path: Path) -> str:
    try:
        import pytesseract
        from PIL import Image
    except ImportError:
        print(
            f"Warning: 'pytesseract' or 'Pillow' is not installed — skipping {path.name}. "
            "Install them with: pip install pytesseract Pillow",
            file=sys.stderr,
        )
        return ""

    try:
        return pytesseract.image_to_string(Image.open(path))
    except pytesseract.TesseractNotFoundError:
        print(
            f"Warning: 'tesseract' binary not found — skipping {path.name}. "
            "Install it with: brew install tesseract",
            file=sys.stderr,
        )
        return ""
