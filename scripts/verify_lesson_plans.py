import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans-data.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("First 15 lines:")
for l in lines[:15]:
    print(l, end='')

# Count occurrences of ថ្នាក់ទី ៨
g8_lines = [l for l in lines if 'ថ្នាក់ទី ៨' in l]
print(f"\nLines with ថ្នាក់ទី ៨: {len(g8_lines)}")

# Count occurrences of ជំពូក in lines that have g8 or are in g8 section
g8_section = False
g8_ch_count = 0
for l in lines:
    if 'LP-8-' in l:
        g8_section = True
    elif 'LP-12-' in l:
        g8_section = False
    if g8_section and 'ជំពូក' in l:
        g8_ch_count += 1
        print("G8 section line with ជំពូក:", l.strip())

print(f"Total ជំពូក in G8 section: {g8_ch_count}")
