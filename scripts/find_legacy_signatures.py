# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

g8_dir = 'កិច្ចការតែងការទី៨'
files = [f for f in os.listdir(g8_dir) if f.endswith('.pdf')]
files.sort()

for f in files[:10]:
    doc = fitz.open(os.path.join(g8_dir, f))
    found = []
    for pno in range(len(doc)):
        txt = doc[pno].get_text()
        if 'ព.ស' in txt or 'រាជធ្ននី' in txt or 'ឯកភាេ' in txt or 'រាជធានី' in txt:
            found.append(pno)
    print(f"{f}: Total={len(doc)}, Sig pages={found}")

