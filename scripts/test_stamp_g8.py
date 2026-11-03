# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = os.path.join('កិច្ចការតែងការទី៨', '8_1_1_មេរៀនទី1_ចំនួនសនិទាន.pdf')
doc = fitz.open(pdf_path)

# Let's inspect Page 0 top
page0 = doc[0]
print("Page 0 rect:", page0.rect)

# Line 1: ថ្នាក់ទី at y: 78.1 - 96.1. Text ':   ៨' is at x: 226.6 to 245.5
# Line 4: កាលបរិច្ឆេទ at y: 141.1 - 159.1. Text ':   ថ្ងៃទី...' is at x: 226.6 to 375.0
# Line 5: បង្រៀនដោយ at y: 162.1 - 180.1. Text ':   ...' is at x: 227.0 to 372.0

# Page 4 signatures:
page4 = doc[4]
print("Page 4 rect:", page4.rect)
# Date line: y: 50.8 - 68.8, x: 397 - 546
# Teacher label: y: 69.1 - 87.1, x: 446 - 495
# Teacher name slot: y: 110 - 140, x: 400 - 540

