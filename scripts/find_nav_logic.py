import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in os.listdir('js'):
    p = os.path.join('js', f)
    with open(p, 'r', encoding='utf-8') as fl:
        t = fl.read()
        if 'showSection' in t or 'switchTab' in t or 'activeTab' in t:
            print(f"Found in {f}")

