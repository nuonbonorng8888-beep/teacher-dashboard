# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

g8_dir = 'កិច្ចការតែងការទី៨'
files = [f for f in os.listdir(g8_dir) if f.endswith('.pdf')]
files.sort()

print(f"Checking signature page locations for 10 files...")
for f in files[:10]:
    doc = fitz.open(os.path.join(g8_dir, f))
    found_pages = []
    for pno in range(len(doc)):
        text = doc[pno].get_text()
        if 'គ្រូបង្រៀន' in text or 'ប្រធានក្រុមបច្ចេកទេស' in text or 'រាជធានីភ្នំពេញ' in text:
            found_pages.append(pno)
    print(f"{f}: Total pages={len(doc)}, Signature page(s)={found_pages}")

