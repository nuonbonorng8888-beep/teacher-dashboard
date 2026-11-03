# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('    generatePrintableHtml(plans) {')
end_idx = code.find('    printPlans(plans, title) {', start_idx)

print("generatePrintableHtml found:", start_idx, "to", end_idx)

