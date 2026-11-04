"""Copy supplied originals and make uncropped, proportional WebP variants."""

import hashlib
import json
import shutil
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "public" / "images" / "designs"
ORIGINALS = TARGET / "originals"
METADATA = ROOT / "src" / "data" / "designs.metadata.json"
SUPPORTED = {".jpeg", ".jpg", ".png", ".webp"}


def main(source_path: str) -> None:
    source = Path(source_path).expanduser().resolve()
    if not source.is_dir():
        raise SystemExit(f"No se encontró la carpeta de fotografías: {source}")

    metadata = json.loads(METADATA.read_text(encoding="utf-8"))
    photographs = sorted(
        (file for file in source.iterdir() if file.is_file() and file.suffix.lower() in SUPPORTED),
        key=lambda file: int("".join(character for character in file.stem if character.isdigit()) or 0),
    )
    if not photographs:
        raise SystemExit("No se encontraron fotografías compatibles en la carpeta indicada.")

    TARGET.mkdir(parents=True, exist_ok=True)
    ORIGINALS.mkdir(parents=True, exist_ok=True)
    digests: dict[str, str] = {}
    used: set[str] = set()

    for photograph in photographs:
        if photograph.stem not in metadata:
            raise SystemExit(f"Falta metadata visual para {photograph.name}: añádela en designs.metadata.json.")
        details = metadata[photograph.stem]
        design_id = details["id"]
        digest = hashlib.sha256(photograph.read_bytes()).hexdigest()
        if digest in digests:
            raise SystemExit(f"Fotografías duplicadas: {digests[digest]} y {photograph.name}.")
        digests[digest] = photograph.name
        used.add(photograph.stem)

        original_copy = ORIGINALS / photograph.name
        shutil.copy2(photograph, original_copy)
        with Image.open(photograph) as source_image:
            source_image.load()
            width, height = source_image.size
            if (width, height) != (details["width"], details["height"]):
                raise SystemExit(
                    f"La resolución de {photograph.name} cambió: se esperaba "
                    f"{details['width']} x {details['height']}, se encontró {width} x {height}."
                )
            image = source_image.convert("RGB")
            image.thumbnail((1200, 2600), Image.Resampling.LANCZOS)
            image.save(TARGET / f"{design_id}-1200.webp", "WEBP", quality=83, method=6)

            thumbnail = source_image.convert("RGB")
            thumbnail.thumbnail((480, 1040), Image.Resampling.LANCZOS)
            thumbnail.save(TARGET / f"{design_id}-480.webp", "WEBP", quality=80, method=6)

        print(f"{photograph.name} => {design_id}: original conservado, WebP {width} x {height} y miniatura.")

    missing = set(metadata) - used
    if missing:
        raise SystemExit(f"No se encontraron las fotografías originales de: {', '.join(sorted(missing))}.")

    print(f"Listo: {len(photographs)} fotografías originales y sus dos versiones WebP.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Uso: python scripts/prepare-gallery.py <carpeta-de-fotografías>")
    main(sys.argv[1])
