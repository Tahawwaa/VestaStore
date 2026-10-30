"""Generate color variants of the linen blazer photo.

Creates public/images/blazer-black.jpg and blazer-brown.jpg from blazer.jpg
by masking the garment (excluding the background and the wooden hanger)
and tinting it while preserving the linen texture and shading.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "images" / "blazer.jpg"

VARIANTS = {
    "black": (52, 51, 48),
    "brown": (128, 100, 78),
}


def flood_from_border(seed: np.ndarray) -> np.ndarray:
    """Return the part of a boolean mask connected to the image border."""
    reached = np.zeros_like(seed)
    reached[0, :] = seed[0, :]
    reached[-1, :] = seed[-1, :]
    reached[:, 0] = seed[:, 0]
    reached[:, -1] = seed[:, -1]
    while True:
        grown = reached.copy()
        grown[1:, :] |= reached[:-1, :]
        grown[:-1, :] |= reached[1:, :]
        grown[:, 1:] |= reached[:, :-1]
        grown[:, :-1] |= reached[:, 1:]
        grown &= seed
        if np.array_equal(grown, reached):
            return reached
        reached = grown


def box_blur(values: np.ndarray, kernel: int) -> np.ndarray:
    """Separable box blur used for a local-variance texture measure."""
    pad = kernel // 2
    padded = np.pad(values, pad, mode="edge")
    rows = np.cumsum(np.pad(padded, ((1, 0), (0, 0))), axis=0)
    vertical = (rows[kernel:, :] - rows[:-kernel, :]) / kernel
    vertical = vertical[: values.shape[0], :]
    cols = np.cumsum(np.pad(vertical, ((0, 0), (1, 0))), axis=1)
    horizontal = (cols[:, kernel:] - cols[:, :-kernel]) / kernel
    return horizontal[:, : values.shape[1]]


def garment_mask(rgb: np.ndarray) -> np.ndarray:
    """Isolate the linen fabric while the backdrop, wooden hanger, metal hook,
    and horn buttons stay untouched.

    The silhouette is found by combining warm saturation with a texture
    measure (the linen weave has far more local variance than the wall),
    closing small gaps, and flood-filling the backdrop from the border.
    """
    smooth = np.asarray(
        Image.fromarray(rgb).filter(ImageFilter.GaussianBlur(3)), dtype=np.float32
    )
    highest = smooth.max(axis=2)
    saturation = (highest - smooth.min(axis=2)) / np.maximum(highest, 1.0)

    gray = rgb.astype(np.float32).mean(axis=2)
    local_mean = box_blur(gray, 9)
    local_sq = box_blur(gray**2, 9)
    texture = np.sqrt(np.maximum(local_sq - local_mean**2, 0.0))

    fabric = ((saturation > 0.17) & (saturation < 0.32)) | (
        (texture > 5.5) & (saturation > 0.10) & (saturation < 0.32)
    )
    closed = (
        Image.fromarray((fabric * 255).astype(np.uint8))
        .filter(ImageFilter.MaxFilter(25))
        .filter(ImageFilter.MinFilter(23))
    )
    silhouette = ~flood_from_border(~(np.asarray(closed) > 127))
    sealed = (
        Image.fromarray((silhouette * 255).astype(np.uint8))
        .filter(ImageFilter.MaxFilter(17))
        .filter(ImageFilter.MinFilter(17))
    )
    silhouette = np.asarray(sealed) > 127

    height, width = silhouette.shape
    keep_original = np.zeros_like(silhouette)
    keep_original[: int(height * 0.11), :] = True  # metal hook
    hanger_band = np.zeros_like(silhouette)
    hanger_band[int(height * 0.10) : int(height * 0.20), int(width * 0.33) : int(width * 0.67)] = True
    keep_original |= hanger_band & (saturation > 0.36)  # wooden hanger
    button_zone = np.zeros_like(silhouette)
    button_zone[
        int(height * 0.56) : int(height * 0.72), int(width * 0.45) : int(width * 0.55)
    ] = True
    keep_original |= button_zone & (saturation > 0.38)  # horn buttons
    keep_original = (
        np.asarray(
            Image.fromarray((keep_original * 255).astype(np.uint8)).filter(
                ImageFilter.MaxFilter(5)
            )
        )
        > 127
    )
    silhouette &= ~keep_original

    blurred = Image.fromarray((silhouette * 255).astype(np.uint8)).filter(
        ImageFilter.GaussianBlur(2)
    )
    return np.asarray(blurred).astype(np.float32) / 255.0


def recolor(rgb: np.ndarray, soft_mask: np.ndarray, target: tuple[int, int, int]) -> np.ndarray:
    as_float = rgb.astype(np.float32) / 255.0
    luminance = as_float @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    reference = 0.74  # average garment brightness in the source photo
    shading = luminance / reference
    target_rgb = np.array(target, dtype=np.float32) / 255.0
    tinted = np.clip(shading[..., None] * target_rgb[None, None, :], 0.0, 1.0)
    highlight = np.clip((luminance - 0.88) / 0.12, 0.0, 1.0)[..., None]
    tinted = tinted * (1.0 - 0.25 * highlight) + (tinted * 0.6 + 0.4) * 0.25 * highlight
    blended = as_float * (1.0 - soft_mask[..., None]) + tinted * soft_mask[..., None]
    return (np.clip(blended, 0.0, 1.0) * 255.0).astype(np.uint8)


def main() -> None:
    source = np.asarray(Image.open(SOURCE).convert("RGB"))
    soft_mask = garment_mask(source)
    for name, target in VARIANTS.items():
        output = ROOT / "public" / "images" / f"blazer-{name}.jpg"
        Image.fromarray(recolor(source, soft_mask, target)).save(output, quality=88)
        print(f"wrote {output}")


if __name__ == "__main__":
    main()
