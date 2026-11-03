# -*- coding: utf-8 -*-
import sys
import os
import fitz

sys.stdout.reconfigure(encoding='utf-8')

g8_dir = 'កិច្ចការតែងការទី៨'
files = [f for f in os.listdir(g8_dir) if f.endswith('.pdf')]
files.sort()

offsets = []
for f in files:
    doc = fitz.open(os.path.join(g8_dir, f))
    total = len(doc)
    sig_pno = None
    for pno in range(total):
        txt = doc[pno].get_text()
        if any(k in txt for k in ['ព.ស', 'រាជធ្ននី', 'រាជធានី', 'ឯកភាេ', 'េិនិែយ']):
            sig_pno = pno
            break
    if sig_pno is not None:
        offsets.append((f, total, sig_pno, sig_pno - total))

print("Total found:", len(offsets))
from collections import Counter
c = Counter(diff for _, _, _, diff in offsets)
print("Offset from end (sig_pno - total):", c)
