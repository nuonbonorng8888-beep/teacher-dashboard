import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add onBatchClassChange and update setClassPreset
target_methods = """    updateClass(id, newClass) {
      const p = this.plans.find(item => item.id === id);
      if (p) {
        p.class_name = newClass;
        this.saveCustomizations(false);
      }
    }

    // Quick toggle for class checkboxes (e.g. 8NGS_C1, 8NGS_C2, 8NGS_B)
    toggleClassCheckbox(clsName) {
      const input = document.getElementById('batchClassInput');
      if (!input) return;
      const checkedBoxes = Array.from(document.querySelectorAll('.class-toggle-checkbox:checked')).map(cb => cb.value);
      if (checkedBoxes.length > 0) {
        if (checkedBoxes.length === 1) {
          input.value = checkedBoxes[0];
        } else if (checkedBoxes.length === 2) {
          input.value = `${checkedBoxes[0]} & ${checkedBoxes[1]}`;
        } else {
          input.value = `${checkedBoxes.slice(0, -1).join(', ')} & ${checkedBoxes[checkedBoxes.length - 1]}`;
        }
      }
      this.savedClass = input.value;
    }

    setClassPreset(clsStr) {
      const input = document.getElementById('batchClassInput');
      if (input) {
        input.value = clsStr;
        this.savedClass = clsStr;
      }
      // Sync checkboxes if matched
      document.querySelectorAll('.class-toggle-checkbox').forEach(cb => {
        cb.checked = clsStr.includes(cb.value);
      });
    }"""

new_methods = """    updateClass(id, newClass) {
      const p = this.plans.find(item => item.id === id);
      if (p) {
        p.class_name = (newClass || '').trim();
        this.saveCustomizations(false);
      }
    }

    onBatchClassChange(val) {
      const cleanVal = (val || '').trim();
      this.savedClass = cleanVal;
      try {
        localStorage.setItem('ngs_custom_class', cleanVal);
        if (this.selectedGrade === 'ថ្នាក់ទី ៨') {
          localStorage.setItem('ngs_custom_class_g8', cleanVal);
        } else if (this.selectedGrade === 'ថ្នាក់ទី ១២') {
          localStorage.setItem('ngs_custom_class_g12', cleanVal);
        }
      } catch (e) {}

      // Update in memory plans for current grade
      if (cleanVal) {
        this.plans.forEach(p => {
          if (p.grade === this.selectedGrade) {
            p.class_name = cleanVal;
          }
        });
        this.saveCustomizations(false);

        // Update all visible card class inputs in DOM directly so user sees changes live!
        document.querySelectorAll('.card-class-input').forEach(inp => {
          inp.value = cleanVal;
        });
      }
    }

    // Quick toggle for class checkboxes (e.g. 8NGS_C1, 8NGS_C2, 8NGS_B)
    toggleClassCheckbox(clsName) {
      const input = document.getElementById('batchClassInput');
      if (!input) return;
      const checkedBoxes = Array.from(document.querySelectorAll('.class-toggle-checkbox:checked')).map(cb => cb.value);
      let clsStr = '';
      if (checkedBoxes.length > 0) {
        if (checkedBoxes.length === 1) {
          clsStr = checkedBoxes[0];
        } else if (checkedBoxes.length === 2) {
          clsStr = `${checkedBoxes[0]} & ${checkedBoxes[1]}`;
        } else {
          clsStr = `${checkedBoxes.slice(0, -1).join(', ')} & ${checkedBoxes[checkedBoxes.length - 1]}`;
        }
      } else {
        clsStr = clsName;
      }
      input.value = clsStr;
      this.onBatchClassChange(clsStr);
    }

    setClassPreset(clsStr) {
      const input = document.getElementById('batchClassInput');
      if (input) {
        input.value = clsStr;
      }
      this.onBatchClassChange(clsStr);
      // Sync checkboxes if matched
      document.querySelectorAll('.class-toggle-checkbox').forEach(cb => {
        cb.checked = clsStr.includes(cb.value);
      });
      if (window.showToast) {
        window.showToast(`✓ បានកំណត់ថ្នាក់បង្រៀនទៅ «${clsStr}» រួចរាល់! 🎉`, 'success');
      }
    }"""

if target_methods not in text:
    target_methods = target_methods.replace('\n', '\r\n')
    new_methods = new_methods.replace('\n', '\r\n')

if target_methods in text:
    text = text.replace(target_methods, new_methods)
    print("Methods updated successfully")
else:
    print("Could not find target methods")

# 2. Update batchClassInput in HTML
target_input = """<input type="text" id="batchClassInput" value="${this.savedClass || (isGrade8 ? '8NGS_C1 & 8NGS_C2' : '១២A')}"
                    class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500"
                    placeholder="ឧ. 8NGS_C1 & 8NGS_C2">"""

new_input = """<input type="text" id="batchClassInput" value="${this.savedClass || (isGrade8 ? '8NGS_C1 & 8NGS_C2' : '១២A')}"
                    oninput="window.lessonPlansManager.onBatchClassChange(this.value)"
                    onchange="window.lessonPlansManager.onBatchClassChange(this.value)"
                    class="w-full px-3 py-2 rounded-xl border border-purple-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-sm focus:outline-none focus:border-purple-500"
                    placeholder="ឧ. 8NGS_B2 ឬ 8NGS_C1 & 8NGS_C2">"""

if target_input not in text:
    target_input = target_input.replace('\n', '\r\n')
    new_input = new_input.replace('\n', '\r\n')

if target_input in text:
    text = text.replace(target_input, new_input)
    print("batchClassInput updated successfully")
else:
    print("Could not find target input")

# 3. Add 8NGS_B2 to presets
target_presets = """                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_B
                  </button>"""

new_presets = """                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_B
                  </button>
                  <button type="button" onclick="window.lessonPlansManager.setClassPreset('8NGS_B2')" class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-purple-100 border border-slate-200 dark:border-slate-600 font-bold text-[11px] text-slate-700 dark:text-slate-200 transition">
                    8NGS_B2
                  </button>"""

if target_presets not in text:
    target_presets = target_presets.replace('\n', '\r\n')
    new_presets = new_presets.replace('\n', '\r\n')

if target_presets in text:
    text = text.replace(target_presets, new_presets)
    print("Presets updated successfully")
else:
    print("Could not find target presets")

# 4. Add card-class-input class to each card's class input
target_card_input = """<input type="text" value="${p.class_name}"
                    onchange="window.lessonPlansManager.updateClass('${p.id}', this.value)"
                    class="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-extrabold text-purple-700 dark:text-purple-300 text-xs focus:outline-none focus:border-purple-500 w-36 sm:w-44">"""

new_card_input = """<input type="text" id="cardClassInput_${p.id}" value="${p.class_name}"
                    onchange="window.lessonPlansManager.updateClass('${p.id}', this.value)"
                    class="card-class-input px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 font-extrabold text-purple-700 dark:text-purple-300 text-xs focus:outline-none focus:border-purple-500 w-36 sm:w-44">"""

if target_card_input not in text:
    target_card_input = target_card_input.replace('\n', '\r\n')
    new_card_input = new_card_input.replace('\n', '\r\n')

if target_card_input in text:
    text = text.replace(target_card_input, new_card_input)
    print("Card class input updated successfully")
else:
    print("Could not find target card input")

# 5. In init(), sync grade default class if no individual plan override
target_init_sync = """        } else if (this.savedTeacher) {
          this.plans.forEach(p => {
            p.teacher = this.savedTeacher;
          });
        }
      } catch (err) {"""

new_init_sync = """        } else if (this.savedTeacher) {
          this.plans.forEach(p => {
            p.teacher = this.savedTeacher;
          });
        }

        // Sync default grade classes if not customized
        const savedG8Class = localStorage.getItem('ngs_custom_class_g8');
        const savedG12Class = localStorage.getItem('ngs_custom_class_g12');
        this.plans.forEach(p => {
          if (p.grade === 'ថ្នាក់ទី ៨' && savedG8Class) {
            if (!customMap || !customMap[p.id] || !customMap[p.id].class_name) {
              p.class_name = savedG8Class;
            }
          } else if (p.grade === 'ថ្នាក់ទី ១២' && savedG12Class) {
            if (!customMap || !customMap[p.id] || !customMap[p.id].class_name) {
              p.class_name = savedG12Class;
            }
          }
        });
      } catch (err) {"""

if target_init_sync not in text:
    target_init_sync = target_init_sync.replace('\n', '\r\n')
    new_init_sync = new_init_sync.replace('\n', '\r\n')

if target_init_sync in text:
    text = text.replace(target_init_sync, new_init_sync)
    print("Init sync updated successfully")
else:
    print("Could not find target init sync")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(text)
