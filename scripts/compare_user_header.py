# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im_user = Image.open("C:/Users/LENOVO/.gemini/antigravity/brain/f1e067a4-40af-4458-9768-938ce551f866/.user_uploaded/media_1793709976052_e788014e.png")
im_banner = Image.open("scratch/full_yukunthor_header_banner.png")

print("User header image size:", im_user.size)
print("full_yukunthor_header_banner size:", im_banner.size)
