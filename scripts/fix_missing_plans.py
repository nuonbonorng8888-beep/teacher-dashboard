# -*- coding: utf-8 -*-
import sys

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the misplaced footer snippet from renderPlansList that caused ReferenceError
bad_snippet = """            <!-- Official Running Footer (Matching User Image 2) -->
            <div style="border-top: 1.5px solid #000; padding-top: 6px; margin-top: 18px; display:flex; justify-content:space-between; align-items:center; font-size: 11px; font-family:'Khmer OS Siemreap', sans-serif; color: #000;">
              <div>បង្រៀនដោយ៖ <strong>${teacherTitle} ${p.teacher}</strong></div>
              <div>- ${toKhmerNum(idx + 1)} -</div>
              <div>លេខទូរស័ព្ទ៖ <strong>${(p.teacher && p.teacher.includes('សុភារី')) ? '096 75 74 005' : '070 794 729'}</strong></div>
            </div>"""

if bad_snippet in content:
    content = content.replace(bad_snippet + "\n", "")
    print("Successfully removed bad snippet from renderPlansList!")
else:
    print("Target snippet not found exactly, searching line by line...")
    lines = content.split('\n')
    new_lines = []
    skip = False
    for l in lines:
        if "<!-- Official Running Footer (Matching User Image 2) -->" in l and not skip:
            skip = True
            continue
        if skip:
            if "</div>" in l and "toKhmerNum" not in l and "teacherTitle" not in l and "096" not in l:
                skip = False
                continue
            continue
        new_lines.append(l)
    content = '\n'.join(new_lines)
    print("Removed via line-by-line filtering!")

# 2. Add Running Footer into generatePrintableHtml where teacherTitle and idx exist!
printable_target = """                    <div style="font-weight: 800; color: #4338ca; font-size: 11px;">${teacherTitle} ${p.teacher}</div>
                  </td>
                </tr>
              </table>
            </div>
          </div>"""

printable_replacement = """                    <div style="font-weight: 800; color: #4338ca; font-size: 11px;">${teacherTitle} ${p.teacher}</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Official Running Footer (Matching User Image 2) -->
            <div style="border-top: 1.5px solid #000; padding-top: 6px; margin-top: 18px; display:flex; justify-content:space-between; align-items:center; font-size: 11px; font-family:'Khmer OS Siemreap', sans-serif; color: #000;">
              <div>បង្រៀនដោយ៖ <strong>${teacherTitle} ${p.teacher}</strong></div>
              <div>- ${toKhmerNum(idx + 1)} -</div>
              <div>លេខទូរស័ព្ទ៖ <strong>${(p.teacher && p.teacher.includes('សុភារី')) ? '096 75 74 005' : '070 794 729'}</strong></div>
            </div>
          </div>"""

if printable_target in content:
    content = content.replace(printable_target, printable_replacement, 1)
    print("Successfully added Running Footer to generatePrintableHtml!")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved js/lesson-plans.js successfully!")

