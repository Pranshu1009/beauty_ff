"""Precise crops from the 2-column mockup + verified Unsplash downloads."""
from pathlib import Path
import urllib.request

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)

ASSETS = Path(r"C:\Users\tiwar\.cursor\projects\c-Users-tiwar-Downloads\assets")
MOCKUP = next(ASSETS.glob("*9c5962c3*.png"))

# Verified Unsplash photo IDs that previously returned 200 OK
UNSPLASH = {
    "hero-portrait.jpg": "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=90",
    "about-portrait.jpg": "https://images.unsplash.com/photo-1580618672591-eb180b1a8613?auto=format&fit=crop&w=1000&q=90",
    "academy.jpg": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
    "contact-portrait.jpg": "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=90",
    "portfolio-1.jpg": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=90",
    "portfolio-2.jpg": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=900&q=90",
    "portfolio-3.jpg": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=90",
    "portfolio-4.jpg": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=90",
    "portfolio-5.jpg": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=90",
    "portfolio-6.jpg": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=900&q=90",
    "portfolio-7.jpg": "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=900&q=90",
    "portfolio-8.jpg": "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=900&q=90",
    "avatar-1.jpg": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=90",
    "avatar-2.jpg": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=90",
    "avatar-3.jpg": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=90",
    "ig-1.jpg": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=90",
    "ig-2.jpg": "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=500&q=90",
    "ig-3.jpg": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=90",
    "ig-4.jpg": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=90",
    "ig-5.jpg": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=500&q=90",
    "ig-6.jpg": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=500&q=90",
}


def upscale(img, min_side=900):
    w, h = img.size
    if max(w, h) >= min_side:
        return img
    scale = min_side / max(w, h)
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def crop_mockup():
    img = Image.open(MOCKUP).convert("RGB")
    w, h = img.size
    print(f"mockup {w}x{h}")

    # Mockup is a 2-column design board. Coordinates tuned from strip analysis.
    crops = {
        # Home hero portrait (brush near face) — left column, right image area
        "mock-hero.jpg": (int(w * 0.30), int(h * 0.03), int(w * 0.49), int(h * 0.20)),
        # About portrait — right column
        "mock-about.jpg": (int(w * 0.72), int(h * 0.04), int(w * 0.96), int(h * 0.22)),
        # Portfolio row (often mid-page full width) — five frames
        "mock-port-1.jpg": (int(w * 0.04), int(h * 0.30), int(w * 0.21), int(h * 0.42)),
        "mock-port-2.jpg": (int(w * 0.22), int(h * 0.30), int(w * 0.39), int(h * 0.42)),
        "mock-port-3.jpg": (int(w * 0.40), int(h * 0.30), int(w * 0.57), int(h * 0.42)),
        "mock-port-4.jpg": (int(w * 0.58), int(h * 0.30), int(w * 0.75), int(h * 0.42)),
        "mock-port-5.jpg": (int(w * 0.76), int(h * 0.30), int(w * 0.93), int(h * 0.42)),
        # Academy classroom (lower mid)
        "mock-academy.jpg": (int(w * 0.04), int(h * 0.55), int(w * 0.48), int(h * 0.68)),
        # Contact portrait bottom right
        "mock-contact.jpg": (int(w * 0.78), int(h * 0.78), int(w * 0.97), int(h * 0.92)),
    }

    for name, box in crops.items():
        cropped = upscale(img.crop(box), 1000)
        cropped.save(OUT / name, quality=95)
        print(f"{name}: {box} -> {cropped.size}")


def download_all():
    opener = urllib.request.build_opener()
    opener.addheaders = [("User-Agent", "Mozilla/5.0")]
    urllib.request.install_opener(opener)
    for name, url in UNSPLASH.items():
        dest = OUT / name
        print(f"download {name}...")
        try:
            urllib.request.urlretrieve(url, dest)
            print(f"  ok {dest.stat().st_size}")
        except Exception as exc:
            print(f"  FAIL {exc}")


if __name__ == "__main__":
    download_all()
    crop_mockup()
    print("done")
