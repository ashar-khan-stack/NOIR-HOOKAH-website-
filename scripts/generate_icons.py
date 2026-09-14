import zlib
import struct
import math
import os

def create_png(width, height, draw_func):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    # PNG Signature
    png = bytearray([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    
    # IHDR chunk
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b"IHDR" + ihdr_data)
    png.extend(struct.pack(">I", 13) + b"IHDR" + ihdr_data + struct.pack(">I", ihdr_crc))
    
    # IDAT chunk
    compressed_data = zlib.compress(raw_data, level=9)
    idat_crc = zlib.crc32(b"IDAT" + compressed_data)
    png.extend(struct.pack(">I", len(compressed_data)) + b"IDAT" + compressed_data + struct.pack(">I", idat_crc))
    
    # IEND chunk
    iend_crc = zlib.crc32(b"IEND")
    png.extend(struct.pack(">I", 0) + b"IEND" + struct.pack(">I", iend_crc))
    
    return bytes(png)

def noir_icon_pixel(x, y, w, h, maskable=False):
    # Normalized coordinates (-1 to 1)
    nx = (x - w / 2) / (w / 2)
    ny = (y - h / 2) / (h / 2)
    dist = math.sqrt(nx * nx + ny * ny)
    
    scale = 0.75 if maskable else 0.90
    snx = nx / scale
    sny = ny / scale
    sdist = math.sqrt(snx * snx + sny * sny)
    
    # Background: obsidian / dark charcoal gradient
    bg_dark = (10, 10, 12, 255)
    bg_subtle = (22, 22, 28, 255)
    t = (ny + 1) / 2
    r = int(bg_dark[0] * (1 - t) + bg_subtle[0] * t)
    g = int(bg_dark[1] * (1 - t) + bg_subtle[1] * t)
    b = int(bg_dark[2] * (1 - t) + bg_subtle[2] * t)
    
    # Gold color palette
    gold_bright = (247, 231, 206)
    gold_main = (212, 175, 55)
    gold_dark = (170, 130, 10)
    
    # Outer gold ring
    if 0.85 <= sdist <= 0.92:
        ring_t = (sdist - 0.85) / 0.07
        ring_blend = math.sin(ring_t * math.pi)
        gr = int(gold_main[0] * ring_blend + r * (1 - ring_blend))
        gg = int(gold_main[1] * ring_blend + g * (1 - ring_blend))
        gb = int(gold_main[2] * ring_blend + b * (1 - ring_blend))
        return (gr, gg, gb, 255)
    
    # Inner gold border
    if 0.77 <= sdist <= 0.80:
        return (gold_dark[0], gold_dark[1], gold_dark[2], 255)
    
    # Stylized "N" letter and Hookah flame/crest
    # Crown/Flame above N (around sny = -0.45 to -0.25)
    if -0.52 <= sny <= -0.32:
        flame_w = 0.12 * (1.0 - (sny + 0.52) / 0.20)
        flame_dist = abs(snx)
        if flame_dist <= 0.18 and abs(sny + 0.42) < 0.10:
            # Diamond crest
            dx = abs(snx) / 0.15
            dy = abs(sny + 0.42) / 0.10
            if dx + dy <= 1.0:
                return (gold_bright[0], gold_bright[1], gold_bright[2], 255)
    
    # Stylized 'N' in center (snx from -0.35 to 0.35, sny from -0.22 to 0.45)
    if -0.22 <= sny <= 0.45:
        # Left bar: snx in [-0.32, -0.20]
        if -0.32 <= snx <= -0.20:
            return (gold_main[0], gold_main[1], gold_main[2], 255)
        # Right bar: snx in [0.20, 0.32]
        if 0.20 <= snx <= 0.32:
            return (gold_main[0], gold_main[1], gold_main[2], 255)
        # Diagonal bar: line from (-0.26, -0.22) to (0.26, 0.45)
        diag_x = -0.26 + (0.52) * ((sny - (-0.22)) / (0.67))
        if abs(snx - diag_x) <= 0.08:
            return (gold_bright[0], gold_bright[1], gold_bright[2], 255)
            
    # Lower gold accent bar
    if 0.52 <= sny <= 0.55 and abs(snx) <= 0.35:
        return (gold_main[0], gold_main[1], gold_main[2], 255)
        
    return (r, g, b, 255)

os.makedirs('public', exist_ok=True)

print("Generating pwa-192x192.png...")
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, lambda x, y, w, h: noir_icon_pixel(x, y, w, h, False)))

print("Generating pwa-512x512.png...")
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, lambda x, y, w, h: noir_icon_pixel(x, y, w, h, False)))

print("Generating pwa-maskable-512x512.png...")
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, lambda x, y, w, h: noir_icon_pixel(x, y, w, h, True)))

print("Generating apple-touch-icon.png...")
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, lambda x, y, w, h: noir_icon_pixel(x, y, w, h, False)))

print("All icons successfully generated!")
