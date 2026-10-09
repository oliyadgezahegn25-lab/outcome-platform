from pathlib import Path
from PIL import Image
import shutil
import re
from urllib.parse import quote

ROOT = Path(".")
OUT = ROOT / "dist"
SKIP_DIRS = {".git", ".github", "dist", "__pycache__"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png"}
MAX_EDGE = 1920
QUALITY = 78

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

# Copy the static site, excluding repository/build internals.
for src in ROOT.rglob("*"):
    if any(part in SKIP_DIRS for part in src.parts):
        continue
    if not src.is_file() or src == Path(__file__):
        continue
    dest = OUT / src.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)

replacements = {}
saved_before = 0
saved_after = 0

# Convert local raster images to responsive-friendly WebP assets.
for src in list(OUT.rglob("*")):
    if not src.is_file() or src.suffix.lower() not in IMAGE_EXTS:
        continue
    try:
        with Image.open(src) as original:
            original.load()
            image = original.convert("RGBA" if "A" in original.getbands() else "RGB")
            image.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
            dest = src.with_suffix(".webp")
            image.save(dest, "WEBP", quality=QUALITY, method=6)
        saved_before += src.stat().st_size
        saved_after += dest.stat().st_size
        old_name = src.name
        new_name = dest.name
        replacements[old_name] = new_name
        replacements[quote(old_name)] = quote(new_name)
        src.unlink()
    except Exception as exc:
        print(f"Keeping original image {src}: {exc}")

# Update references in all text assets (HTML, CSS, JS, XML, JSON, SVG, etc.).
text_exts = {".html", ".css", ".js", ".json", ".xml", ".txt", ".md", ".svg", ".webmanifest"}
for path in OUT.rglob("*"):
    if not path.is_file() or path.suffix.lower() not in text_exts:
        continue
    try:
        content = path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue
    updated = content
    for old, new in replacements.items():
        updated = updated.replace(old, new)
    if updated != content:
        path.write_text(updated, encoding="utf-8")

print(f"Optimized {len(replacements)} local images.")
print(f"Converted source bytes: {saved_before:,}; WebP bytes: {saved_after:,}.")
if saved_before:
    print(f"Raster image payload reduction: {(1 - saved_after / saved_before) * 100:.1f}% (before network/cache effects).")
