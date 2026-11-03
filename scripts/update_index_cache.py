import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('js/lesson-plans-data.js?v=6.8', 'js/lesson-plans-data.js?v=6.9')
text = text.replace('js/lesson-plans.js?v=6.8', 'js/lesson-plans.js?v=6.9')
text = text.replace('js/curriculum-outlines.js?v=5.9', 'js/curriculum-outlines.js?v=6.9')
text = text.replace('js/teaching-slides-data.js?v=6.6', 'js/teaching-slides-data.js?v=6.9')
text = text.replace('js/teaching-slides.js?v=6.6', 'js/teaching-slides.js?v=6.9')
text = text.replace('js/app.js?v=5.7', 'js/app.js?v=6.9')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated cache busters in index.html to v=6.9.")
