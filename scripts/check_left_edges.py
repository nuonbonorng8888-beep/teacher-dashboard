from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

for name in ['verified_merged_p5.png', 'verified_merged_p11.png', 'verified_merged_p19.png']:
    p = os.path.join(artifacts_dir, name)
    im = Image.open(p).convert('L')
    w, h = im.size
    # Check left region: x from 0 to 60 pt * (w / 595.3) ~ 0 to 125 px
    # y from 100 pt to 350 pt
    scale = w / 595.3
    x_max = int(55.0 * scale)
    y_min = int(80.0 * scale)
    y_max = int(350.0 * scale)
    
    crop = im.crop((0, y_min, x_max, y_max))
    crop_path = os.path.join(artifacts_dir, f"crop_left_{name}")
    crop.save(crop_path)
    
    # Check if there are any non-white pixels
    dark_pixels = [crop.getpixel((x, y)) for x in range(crop.size[0]) for y in range(crop.size[1]) if crop.getpixel((x, y)) < 220]
    print(f"{name}: crop size {crop.size}, dark pixels in left margin [0..{x_max}]: {len(dark_pixels)}")

