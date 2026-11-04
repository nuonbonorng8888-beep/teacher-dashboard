import subprocess
import os

html = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: white; font-family: "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif; }
  </style>
</head>
<body>
  <canvas id="c" width="600" height="250"></canvas>
  <script>
    const c = document.getElementById('c');
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 250);
    ctx.fillStyle = '#000000';
    ctx.font = '24px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
    ctx.fillText("3. ចូររៀបចំនួនសនិទានខាងក្រោមតាមលំដាប់កើនឡើង៖", 15, 45);
    ctx.fillText("ក.  3/4 ,  4/5 ,  7/8 ,  0.75", 15, 95);
    ctx.fillText("ខ.  3/4 ,  5/6 ,  11/12 ,  8/9", 15, 145);
    
    // send image to python or save
    const dataUrl = c.toDataURL('image/png');
    const link = document.createElement('a');
    fetch('/upload_rendered_item3', { method: 'POST', body: dataUrl });
  </script>
</body>
</html>
"""

os.makedirs('scratch', exist_ok=True)
with open('scratch/render_khmer_text.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved scratch/render_khmer_text.html")

