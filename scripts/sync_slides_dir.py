import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Ensure slides directory exists with copies so both 'slides/...' and 'slidesទី១២/...' work!
os.makedirs('slides', exist_ok=True)
for f in os.listdir('slidesទី១២'):
    src = os.path.join('slidesទី១២', f)
    dst = os.path.join('slides', f)
    if not os.path.exists(dst):
        shutil.copy2(src, dst)
        print("Copied to slides/:", f)

if os.path.exists('slidesទី១១'):
    for f in os.listdir('slidesទី១១'):
        src = os.path.join('slidesទី១១', f)
        dst = os.path.join('slides', f)
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
            print("Copied to slides/:", f)

print("Slides directory synced successfully.")

