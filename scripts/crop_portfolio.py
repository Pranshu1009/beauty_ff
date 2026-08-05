from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
ASSETS = Path(r"C:\Users\tiwar\.cursor\projects\c-Users-tiwar-Downloads\assets")
MOCKUP = next(ASSETS.glob("*9c5962c3*.png"))

img = Image.open(MOCKUP).convert("RGB")
w, h = img.size


def save(name, box, min_side=1000):
    cropped = img.crop(box)
    cw, ch = cropped.size
    if max(cw, ch) < min_side:
        scale = min_side / max(cw, ch)
        cropped = cropped.resize((int(cw * scale), int(ch * scale)), Image.Resampling.LANCZOS)
    cropped.save(OUT / name, quality=95)
    print(name, box, "->", cropped.size)


# Portfolio gallery — left board, strip ~4-5
# Five vertical portraits side by side
y0, y1 = int(h * 0.415), int(h * 0.515)
left, right = int(w * 0.02), int(w * 0.49)
span = right - left
for i in range(5):
    x0 = left + int(i * span / 5)
    x1 = left + int((i + 1) * span / 5)
    save(f"portfolio-{i + 1}.jpg", (x0, y0, x1, y1))
    save(f"mock-port-{i + 1}.jpg", (x0, y0, x1, y1))

# Academy classroom — around strip 6 left area
save("academy.jpg", (int(w * 0.02), int(h * 0.55), int(w * 0.48), int(h * 0.68)))
save("mock-academy.jpg", (int(w * 0.02), int(h * 0.55), int(w * 0.48), int(h * 0.68)))

# Extra portfolio items from right-side looks if available / reuse
save("portfolio-6.jpg", (int(w * 0.10), y0, int(w * 0.20), y1))
save("portfolio-7.jpg", (int(w * 0.28), y0, int(w * 0.38), y1))
save("portfolio-8.jpg", (int(w * 0.38), y0, int(w * 0.48), y1))

# Instagram thumbs from portfolio
for i in range(1, 7):
    src = OUT / f"portfolio-{(i % 5) + 1}.jpg"
    if src.exists():
        im = Image.open(src).convert("RGB")
        im = im.resize((500, 500), Image.Resampling.LANCZOS)
        im.save(OUT / f"ig-{i}.jpg", quality=92)

print("done")
