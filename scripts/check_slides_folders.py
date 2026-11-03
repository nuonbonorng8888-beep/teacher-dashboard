import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for g in ['៧', '៨', '៩', '១០', '១១', '១២']:
    folder = f'slidesទី{g}'
    if os.path.exists(folder):
        files = os.listdir(folder)
        print(f"=== {folder} ({len(files)} files) ===")
        for f in files:
            print("  ", f)

