import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx1 = text.find('មេរៀនទី ${ls.lesson_num}')
print(text[idx1-100:idx1+800])
