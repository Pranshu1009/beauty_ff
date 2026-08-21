from pathlib import Path

import numpy as np
from PIL import Image
from rembg import remove
from scipy.ndimage import binary_erosion, gaussian_filter

SRC = Path(
    r"C:\Users\tiwar\.cursor\projects\c-Users-tiwar-Downloads-roshani-makeup-artist\assets\c__Users_tiwar_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_WhatsApp_Image_2026-08-13_at_4.21.54_PM-aa2d9f1e-6e76-4c7e-afcf-a58d52c260ec.png"
)
DEST = Path(r"C:\Users\tiwar\Downloads\roshani-makeup-artist\public\images\about-portrait.png")


def main():
    src_img = Image.open(SRC).convert("RGBA")
    cut = remove(src_img).convert("RGBA")
    arr = np.asarray(cut).astype(np.float32)
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3] / 255.0
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    warm = (r > g + 8) & (r > b + 12) & (luma > 70)

    solid = alpha > 0.4
    interior = binary_erosion(solid, iterations=14)
    edge = (alpha > 0.08) & (~interior)
    bright = luma > 55
    glow = edge & (warm | bright | ((alpha > 0.05) & (alpha < 0.8) & (luma > 48)))

    # Drop the backlight halo around hair/shoulders.
    fade = gaussian_filter(glow.astype(np.float32), sigma=1.6)
    fade = np.clip(fade * 1.15, 0, 1)
    alpha = np.clip(alpha * (1.0 - 0.97 * fade), 0, 1)

    # Neutralize leftover warm fringe toward darker hair.
    hair = np.array([38, 28, 22], dtype=np.float32)
    w = fade[..., None]
    rgb = rgb * (1.0 - 0.9 * w) + hair * (0.9 * w)

    out = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha * 255.0, 0, 255)]).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(DEST, format="PNG", optimize=True)
    print(f"saved {DEST} {out.shape} {DEST.stat().st_size} glow_frac={float(glow.mean()):.4f}")


if __name__ == "__main__":
    main()
