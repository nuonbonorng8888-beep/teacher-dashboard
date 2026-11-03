# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect g12_header_clip.png and g12_plan1_sig_rendered.png
doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p0 = doc[0]
p2 = doc[2]

print("=== Grade 12 Header on Page 0 ===")
for b in p0.get_text("blocks"):
    if 90 < b[1] < 210:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {b[4].strip()}")

print("\n=== Grade 12 Signature on Page 2 ===")
for b in p2.get_text("blocks"):
    if b[1] > 550:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} | {b[4].strip()}")

