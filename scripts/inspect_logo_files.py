# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

for p in ['images/yukunthor-logo.jpg', 'scratch/yukunthor_logo.jpg', 'scratch/full_yukunthor_header_banner.png', 'scratch/yukunthor_header_text.png']:
    try:
        im = Image.open(p)
        print(f"{p}: size={im.size}, mode={im.mode}")
    except Exception as e:
        print(f"{p}: {e}")
