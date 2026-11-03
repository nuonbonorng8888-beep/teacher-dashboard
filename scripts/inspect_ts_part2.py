import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('<!-- Chapters & Lessons Accordion/Cards -->')
print(text[idx1:idx1+1800])
