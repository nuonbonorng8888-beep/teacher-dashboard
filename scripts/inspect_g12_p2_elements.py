# -*- coding: utf-8 -*-
import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = fitz.open("ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf")
p2 = doc[2]

# Let's inspect all images on page 2
img_list = p2.get_images()
print("Images on G12 p2:", len(img_list))
for img_info in img_list:
    xref = img_info[0]
    base_image = doc.extract_image(xref)
    print(f"xref {xref}: {base_image['width']}x{base_image['height']}, ext={base_image['ext']}")

# And check drawings or text
for b in p2.get_text("blocks"):
    if b[1] > 550:
        print(f"y: {b[1]:.1f}-{b[3]:.1f}, x: {b[0]:.1f}-{b[2]:.1f} -> {repr(b[4].strip())}")

