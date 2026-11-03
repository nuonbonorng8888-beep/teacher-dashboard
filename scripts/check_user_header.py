# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im = Image.open("scratch/user_header_sample.png")
print("user_header_sample.png size:", im.size)

