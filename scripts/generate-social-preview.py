"""Render the Nails by Valeria Open Graph image from the official palette."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUTPUT = Path(__file__).resolve().parent.parent / "public" / "images" / "branding" / "social-preview.png"
BACKGROUND = "#F8F4F0"
INK = "#302824"
MUTED = "#706660"
SAND = "#E8D8D0"
GOLD = "#A58A62"


def font(size: int, serif: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = ("georgia.ttf", "times.ttf") if serif else ("arial.ttf", "calibri.ttf")
    folders = (Path("C:/Windows/Fonts"), Path("/usr/share/fonts/truetype/msttcorefonts"))
    for folder in folders:
        for name in names:
            try:
                return ImageFont.truetype(str(folder / name), size=size)
            except OSError:
                continue
    return ImageFont.load_default(size=size)


def main() -> None:
    image = Image.new("RGB", (1200, 630), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw.pieslice((705, -170, 1355, 790), 78, 275, fill=SAND)
    draw.ellipse((814, 128, 1184, 498), outline="#B99483", width=2)
    draw.ellipse((838, 152, 1160, 474), outline=GOLD, width=1)
    draw.text((112, 125), "NAIL ART · NICARAGUA", fill=MUTED, font=font(20))
    draw.text((105, 231), "Nails by Valeria", fill=INK, font=font(83, serif=True))
    draw.line((112, 357, 197, 357), fill=GOLD, width=2)
    draw.text((111, 385), "Beauty in every detail.", fill="#55463B", font=font(41, serif=True))
    draw.text((965, 173), "V", fill=INK, font=font(181, serif=True), anchor="mm")
    draw.text((112, 547), "TRABAJOS REALES · DISEÑOS DE UÑAS · NICARAGUA", fill=MUTED, font=font(15))
    image.save(OUTPUT, "PNG", optimize=True)
    print(f"Imagen social Nails by Valeria lista: {OUTPUT} ({image.width} x {image.height}).")


if __name__ == "__main__":
    main()
