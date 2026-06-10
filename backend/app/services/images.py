"""Image probing + variant generation (thumb/card/hero)."""
from __future__ import annotations

import io
from dataclasses import dataclass

from PIL import Image, ImageOps

VARIANTS = {
    "thumb": 320,
    "card": 640,
    "hero": 1600,
}


@dataclass
class ImageMeta:
    width: int
    height: int


def probe(blob: bytes) -> ImageMeta | None:
    try:
        with Image.open(io.BytesIO(blob)) as im:
            im.load()
            return ImageMeta(width=im.width, height=im.height)
    except Exception:
        return None


def make_variant(blob: bytes, *, max_width: int, quality: int = 82) -> bytes:
    """Resize (preserving aspect) so max(width) ≤ `max_width`; return WebP bytes."""
    with Image.open(io.BytesIO(blob)) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")
        if im.width > max_width:
            ratio = max_width / im.width
            new_size = (max_width, max(1, round(im.height * ratio)))
            im = im.resize(new_size, Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, format="WEBP", quality=quality, method=6)
        return buf.getvalue()
