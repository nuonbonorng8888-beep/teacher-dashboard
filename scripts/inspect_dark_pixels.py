from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

for name in ['verified_merged_p5.png', 'verified_merged_p19.png']:
    p = os.path.join(artifacts_dir, name)
    im = Image.open(p).convert('L')
    w, h = im.size
    scale = w / 595.3
    
    print(f"\n=== Inspecting {name} (scale={scale:.2f}) ===")
    for y in range(int(70 * scale), int(360 * scale), 2):
        for x in range(int(10 * scale), int(60 * scale)):
            if im.getpixel((x, y)) < 200:
                print(f"Dark pixel at pt x={x/scale:.1f}, y={y/scale:.1f}: val={im.getpixel((x, y))}")
                break

