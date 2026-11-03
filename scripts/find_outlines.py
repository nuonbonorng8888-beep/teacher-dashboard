import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('js'):
    for f in files:
        if f.endswith('.js'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fl:
                if 'NGS_CURRICULUM_OUTLINES' in fl.read():
                    print("Found NGS_CURRICULUM_OUTLINES in:", p)

