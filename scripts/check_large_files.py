import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    if '.git' in root:
        continue
    for f in files:
        p = os.path.join(root, f)
        try:
            sz = os.path.getsize(p)
            if sz > 25 * 1024 * 1024:
                print(f"Large file (>25MB): {p} ({sz / (1024*1024):.2f} MB)")
        except Exception:
            pass

