# -*- coding: utf-8 -*-
from PIL import Image
import pytesseract
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Let's inspect crop0_check.png
# We can check with OCR or pixel analysis
try:
    text0 = pytesseract.image_to_string(Image.open('scratch/crop0_check.png'), lang='khm')
    print("OCR text0:", text0)
except Exception as e:
    print("OCR not available:", e)
