from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
p = os.path.join(artifacts_dir, 'sig_crop_verified_merged_p19.png')
im = Image.open(p)
w, h = im.size

# In p19, let's crop around the left signature column
# x: 20 to 300 pt, y: full crop height
scale = w / 595.3
crop_col_left = im.crop((int(20 * scale), 0, int(220 * scale), h))
crop_col_left.save(os.path.join(artifacts_dir, 'crop_p19_left_column.png'))
print(f"Saved crop_p19_left_column.png (size={crop_col_left.size})")
