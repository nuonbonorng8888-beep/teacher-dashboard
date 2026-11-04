from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

# 1. Inspect 8_1_1 Item 3 & Date
im1 = Image.open(os.path.join(artifacts_dir, 'verified_fixed_8_1_1_item3.png'))
w, h = im1.size
scale = w / 595.3
# Crop item 3 table
crop_table = im1.crop((int(60 * scale), int(45 * scale), int(585 * scale), int(145 * scale)))
crop_table.save(os.path.join(artifacts_dir, 'check_crop_item3_table.png'))

# Crop signature date (right side)
crop_date = im1.crop((int(320 * scale), int(145 * scale), int(585 * scale), int(200 * scale)))
crop_date.save(os.path.join(artifacts_dir, 'check_crop_sig_date.png'))

# 2. Inspect 8_12_1 Cover page top
im2 = Image.open(os.path.join(artifacts_dir, 'verified_fixed_8_12_1_cover.png'))
w2, h2 = im2.size
scale2 = w2 / 595.3
crop_cover = im2.crop((int(50 * scale2), int(15 * scale2), int(550 * scale2), int(210 * scale2)))
crop_cover.save(os.path.join(artifacts_dir, 'check_crop_8_12_1_cover.png'))

# 3. Inspect 8_12_1 Sig page top
im3 = Image.open(os.path.join(artifacts_dir, 'verified_fixed_8_12_1_sig_page.png'))
w3, h3 = im3.size
scale3 = w3 / 595.3
crop_sig_top = im3.crop((int(50 * scale3), 0, int(550 * scale3), int(150 * scale3)))
crop_sig_top.save(os.path.join(artifacts_dir, 'check_crop_8_12_1_sig_page_top.png'))

print("All check crops saved to artifacts successfully!")
