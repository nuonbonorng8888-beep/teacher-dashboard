import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    if '.git' in root or '__pycache__' in root or 'scratch' in root or '.system_generated' in root:
        continue
    for f in files:
        if f.endswith('.js') or f.endswith('.html') or f.endswith('.py'):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8') as fl:
                    txt = fl.read()
                    matches = re.findall(r'slides/[^\s"\'<>]+', txt)
                    if matches:
                        print(f"File {p} references:")
                        for m in set(matches):
                            print(" ", m)
            except Exception as e:
                pass

