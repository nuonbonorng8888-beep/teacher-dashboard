import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('js/lesson-plans.js?v=6.9', 'js/lesson-plans.js?v=7.0')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Bumped cache buster to v=7.0 in index.html")

