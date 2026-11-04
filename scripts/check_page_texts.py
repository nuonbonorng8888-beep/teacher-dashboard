import pymupdf
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
pdf_path = os.path.join(artifacts_dir, 'test_g8_fixed_merged.pdf')
doc = pymupdf.open(pdf_path)

# Let's check page 19 text
p19 = doc[18]
print("Page 19 text:")
print(p19.get_text())

print("\nPage 11 text:")
p11 = doc[10]
print(p11.get_text())

print("\nPage 5 text:")
p5 = doc[4]
print(p5.get_text())
