# -*- coding: utf-8 -*-
import os, sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.pdf'):
            path = os.path.join(root, f)
            print(f"{path} ({os.path.getsize(path)} bytes)")

