# -*- coding: utf-8 -*-
from PIL import Image
import sys

sys.stdout.reconfigure(encoding='utf-8')

im_logo = Image.open("images/yukunthor-logo.jpg")
print("images/yukunthor-logo.jpg:", im_logo.size, im_logo.format)

# Also let's crop the logo from scratch/user_header_sample.png
im_user = Image.open("scratch/user_header_sample.png")
# The logo is in the leftmost part: x: 30 to 110, y: 10 to 80
w, h = im_user.size
crop_logo = im_user.crop((30, 10, 115, 85))
crop_logo.save("scratch/user_cropped_logo.png")
print("Saved user cropped logo:", crop_logo.size)
