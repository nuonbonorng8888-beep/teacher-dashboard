import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect renderGradeSyllabusView
idx1 = text.find('renderGradeSyllabusView(grade) {')
idx2 = text.find('openPresenter(lessonId) {', idx1)
print(text[idx1:idx1+1500])
