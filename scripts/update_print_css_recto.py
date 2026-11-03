# -*- coding: utf-8 -*-
import sys

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = """  body.printing-lesson-plans .lesson-plan-print-page {
    page-break-after: always !important;
    break-after: page !important;
    display: block !important;
    width: 100% !important;
    margin: 0 0 20px 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif !important;
    font-size: 10.5pt !important;
    line-height: 1.4 !important;
    color: #111827 !important;
    background: #ffffff !important;
  }"""

replacement = """  /* Duplex Printing: Every lesson plan MUST start on an ODD page (Recto) */
  body.printing-lesson-plans .lesson-plan-print-page {
    break-before: recto !important;
    page-break-before: right !important;
    page-break-after: always !important;
    break-after: page !important;
    display: block !important;
    width: 100% !important;
    margin: 0 0 20px 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif !important;
    font-size: 10.5pt !important;
    line-height: 1.4 !important;
    color: #111827 !important;
    background: #ffffff !important;
  }"""

css_norm = css.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in css_norm:
    css_norm = css_norm.replace(target_norm, replacement_norm, 1)
    with open('css/style.css', 'w', encoding='utf-8') as f:
        f.write(css_norm)
    print("Updated css/style.css with duplex recto rules!")
else:
    print("target_norm not found in css_norm!")
