import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "this.selectedGrade = '12'; // '12', '11', '10', '9', '8', '7', 'template'"
replacement = "const slideGradeParam = new URLSearchParams(window.location.search).get('slideGrade');\n      this.selectedGrade = slideGradeParam || '12'; // '12', '11', '10', '9', '8', '7', 'template'"

if target in text:
    text = text.replace(target, replacement)
    with open('js/teaching-slides.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated selectedGrade param support in js/teaching-slides.js")
else:
    print("Target not found")
