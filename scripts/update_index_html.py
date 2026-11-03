# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update css/style.css?v=... to ?v=7.1
import re
content = re.sub(r'href="css/style\.css\?v=[^"]+"', 'href="css/style.css?v=7.1"', content)

# 2. Update js/lesson-plans.js?v=... to ?v=7.1
content = re.sub(r'src="js/lesson-plans\.js\?v=[^"]+"', 'src="js/lesson-plans.js?v=7.1"', content)

# 3. Add printableLessonPlansArea before toastContainer if not already there
if 'id="printableLessonPlansArea"' not in content:
    target = '  <!-- Toast Container -->'
    replacement = '''  <!-- Printable Area for Lesson Plans (Clean A4 Print & Save as PDF) -->
  <div id="printableLessonPlansArea" class="hidden"></div>

  <!-- Toast Container -->'''
    if target in content:
        content = content.replace(target, replacement, 1)
        print("printableLessonPlansArea added before toastContainer.")
    else:
        print("WARNING: toastContainer target not found!")
else:
    print("printableLessonPlansArea already exists in index.html.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html updated successfully!")
