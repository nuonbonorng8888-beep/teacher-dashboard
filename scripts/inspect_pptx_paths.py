import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("--- Lines 460 to 515 ---")
for i in range(460, min(515, len(lines))):
    print(f"{i}: {lines[i]}", end='')

print("\n--- Lines 870 to 900 ---")
for i in range(870, min(900, len(lines))):
    print(f"{i}: {lines[i]}", end='')
