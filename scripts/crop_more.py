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
    if cw < 10 or ch < 10:
        print("skip", name, box)
        return
    if max(cw, ch) < min_side:
        scale = min_side / max(cw, ch)
        cropped = cropped.resize((int(cw * scale), int(ch * scale)), Image.Resampling.LANCZOS)
    cropped.save(OUT / name, quality=95)
    print(name, "->", cropped.size)


# Academy photo — right column of design board around rows 6-7
save("academy.jpg", (int(w * 0.50), int(h * 0.58), int(w * 0.74), int(h * 0.72)))

# Contact portrait near bottom
save("contact-portrait.jpg", (int(w * 0.78), int(h * 0.78), int(w * 0.97), int(h * 0.93)))

# TV show card logos from celebrity section (left/mid around strip 6)
y0, y1 = int(h * 0.545), int(h * 0.62)
left, right = int(w * 0.04), int(w * 0.48)
span = right - left
for i in range(5):
    x0 = left + int(i * span / 5)
    x1 = left + int((i + 1) * span / 5)
    save(f"tv-{i + 1}.jpg", (x0, y0, x1, y1), min_side=500)

# Cleaner portfolio crops — nudge up slightly to avoid CTA text bleed
y0, y1 = int(h * 0.418), int(h * 0.505)
left, right = int(w * 0.02), int(w * 0.49)
span = right - left
for i in range(5):
    x0 = left + int(i * span / 5) + 2
    x1 = left + int((i + 1) * span / 5) - 2
    save(f"portfolio-{i + 1}.jpg", (x0, y0, x1, y1))

print("done")
