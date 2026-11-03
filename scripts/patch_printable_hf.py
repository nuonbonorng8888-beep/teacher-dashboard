# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update batchTeacherSelect HTML in render()
old_select_block = """              <!-- 1. Teacher Selector (Nuon Bonorng or Thaong Sophary) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                  👨‍🏫 គ្រូបង្រៀន (Teacher Switcher):
                </label>
                <select id="batchTeacherSelect" onchange="window.lessonPlansManager.setTeacher(this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="នួន បូណង" ${this.savedTeacher === 'នួន បូណង' ? 'selected' : ''}>👨‍🏫 លោកគ្រូ នួន បូណង</option>
                  <option value="ថោង សុភារី" ${this.savedTeacher === 'ថោង សុភារី' ? 'selected' : ''}>👩‍🏫 អ្នកគ្រូ ថោង សុភារី</option>
                </select>
              </div>"""

new_select_block = """              <!-- 1. Teacher Selector (Nuon Bonorng or Thaong Sophary) -->
              <div>
                <label class="block text-[11px] font-bold text-purple-800 dark:text-purple-300 mb-1">
                  👨‍🏫 គ្រូបង្រៀន (Teacher Switcher):
                </label>
                <select id="batchTeacherSelect" onchange="window.lessonPlansManager.setTeacher(this.value)"
                  class="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-purple-900 dark:text-purple-200 shadow-sm focus:outline-none focus:border-purple-500">
                  <option value="នួន បូណង" ${this.savedTeacher === 'នួន បូណង' ? 'selected' : ''}>👨‍🏫 លោកគ្រូ នួន បូណង (070 794 729)</option>
                  <option value="ថោង សុភារី" ${this.savedTeacher === 'ថោង សុភារី' ? 'selected' : ''}>👩‍🏫 អ្នកគ្រូ ថោង សុភារី (096 75 74 005)</option>
                </select>
                <div class="mt-1 text-[10px] text-purple-700 dark:text-purple-300 font-semibold flex items-center justify-between">
                  <span>📞 ទូរស័ព្ទ៖ <strong class="underline">${this.getTeacherPhone()}</strong></span>
                  <span class="text-slate-400">|</span>
                  <span>${this.getTeacherFullTitle()}</span>
                </div>
              </div>"""

if old_select_block in code:
    code = code.replace(old_select_block, new_select_block, 1)
    print("SUCCESS: Updated batchTeacherSelect in render()")
else:
    print("WARNING: old_select_block not found exactly, searching partial")

# 2. Update generatePrintableHtml to include Running Header & Running Footer
# Check lines in generatePrintableHtml
old_header_start = """            <!-- Official Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">
              <div style="text-align:center; min-width: 220px;">
                <div style="font-size: 13px; font-weight: bold; color: #1e293b;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
                <div style="font-size: 14px; font-weight: 800; color: #4338ca;">វិទ្យាល័យព្រះយុគន្ធរ</div>
                <div style="font-size: 11px; font-weight: bold; color: #6d28d9;">សាលារៀនជំនាន់ថ្មី (NGS)</div>
              </div>
              <div style="text-align:center; min-width: 240px;">
                <div style="font-size: 14px; font-weight: 800; color: #0f172a;">ព្រះរាជាណាចក្រកម្ពុជា</div>
                <div style="font-size: 13px; font-weight: bold; color: #0f172a;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
                <div style="letter-spacing: 5px; font-size: 11px; color: #64748b; margin-top: 2px;">*** ៚ ៚ ៚ ***</div>
              </div>
            </div>"""

new_header_start = """            <!-- Official Running Header (Matching User Image 1) -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1.5px solid #000; padding-bottom: 6px; margin-bottom: 14px;">
              <div style="display:flex; align-items:center; gap: 10px;">
                <img src="images/yukunthor-logo.jpg" style="width: 32px; height: 32px; object-fit: contain;">
                <span style="font-family:'Khmer OS Muol Light', sans-serif; font-size: 13.5px; font-weight: bold; color: #000;">
                  វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)
                </span>
              </div>
            </div>"""

if old_header_start in code:
    code = code.replace(old_header_start, new_header_start, 1)
    print("SUCCESS: Updated header in generatePrintableHtml")
else:
    print("WARNING: old_header_start not found")

# Footer in generatePrintableHtml
old_footer_target = """            </div>
          </div>
        `;
      }).join('');"""

new_footer_target = """            </div>

            <!-- Official Running Footer (Matching User Image 2) -->
            <div style="border-top: 1.5px solid #000; padding-top: 6px; margin-top: 18px; display:flex; justify-content:space-between; align-items:center; font-size: 11px; font-family:'Khmer OS Siemreap', sans-serif; color: #000;">
              <div>បង្រៀនដោយ៖ <strong>${teacherTitle} ${p.teacher}</strong></div>
              <div>- ${toKhmerNum(idx + 1)} -</div>
              <div>លេខទូរស័ព្ទ៖ <strong>${(p.teacher && p.teacher.includes('សុភារី')) ? '096 75 74 005' : '070 794 729'}</strong></div>
            </div>
          </div>
        `;
      }).join('');"""

# Make sure plans.map((p, idx) => { has idx
code = code.replace("return plans.map(p => {", "return plans.map((p, idx) => {", 1)

if old_footer_target in code:
    code = code.replace(old_footer_target, new_footer_target, 1)
    print("SUCCESS: Updated footer in generatePrintableHtml")
else:
    print("WARNING: old_footer_target not found")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: js/lesson-plans.js updated!")

