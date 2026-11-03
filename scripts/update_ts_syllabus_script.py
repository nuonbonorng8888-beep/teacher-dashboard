import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace header chapter badge
old_badge = '<span class="text-xs font-bold font-battambang px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">\n                    ${ch.lessons.length} មេរៀន\n                  </span>'
new_badge = '<span class="text-xs font-bold font-battambang px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">\n                    ${ch.lessons.length} ${gData.is_flat_lessons ? "ម៉ោងបង្រៀន" : "មេរៀន"}\n                  </span>'

if old_badge not in text:
    # try with \r\n
    old_badge = old_badge.replace('\n', '\r\n')
    new_badge = new_badge.replace('\n', '\r\n')

if old_badge in text:
    text = text.replace(old_badge, new_badge)
    print("Replaced badge successfully")
else:
    print("Badge not found")

# Replace lesson tag
old_tag = '<span class="text-xs font-bold text-purple-600 dark:text-purple-400 font-battambang">\n                            មេរៀនទី ${ls.lesson_num}\n                          </span>'
new_tag = '<span class="text-xs font-bold text-purple-600 dark:text-purple-400 font-battambang">\n                            ${gData.is_flat_lessons ? "ម៉ោងទី " + ls.lesson_num : "មេរៀនទី " + ls.lesson_num}\n                          </span>'

if old_tag not in text:
    old_tag = old_tag.replace('\n', '\r\n')
    new_tag = new_tag.replace('\n', '\r\n')

if old_tag in text:
    text = text.replace(old_tag, new_tag)
    print("Replaced lesson tag successfully")
else:
    print("Lesson tag not found")

with open('js/teaching-slides.js', 'w', encoding='utf-8') as f:
    f.write(text)
