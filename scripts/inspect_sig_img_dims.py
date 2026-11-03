# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

for img_path in ['images/sample_sig_columns_clean.png', 'images/sample_sig_block_authentic.png']:
    im = Image.open(img_path)
    print(f"{img_path}: format={im.format}, size={im.size}, mode={im.mode}")

