from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

for name in ['verified_merged_p5.png', 'verified_merged_p11.png', 'verified_merged_p19.png']:
    p = os.path.join(artifacts_dir, name)
    im = Image.open(p)
    w, h = im.size
    scale = w / 595.3
    
    # Crop the signature area
    if 'p5' in name:
        y0, y1 = int(120 * scale), int(330 * scale)
    elif 'p11' in name:
        y0, y1 = int(600 * scale), int(810 * scale)
    else: # p19
        y0, y1 = int(190 * scale), int(400 * scale)
        
    crop = im.crop((0, y0, w, y1))
    crop_path = os.path.join(artifacts_dir, f"sig_crop_{name}")
    crop.save(crop_path)
    print(f"Saved {crop_path}")

