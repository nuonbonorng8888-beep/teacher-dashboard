import os
import sys
import subprocess
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import base64

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('scratch', exist_ok=True)
rendered_png = os.path.join('scratch', 'perfect_item3_table.png')

done_event = threading.Event()

class RenderHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_item3':
            length = int(self.headers['Content-Length'])
            data = self.rfile.read(length).decode('utf-8')
            # data is data:image/png;base64,...
            b64_data = data.split(',', 1)[1]
            with open(rendered_png, 'wb') as f:
                f.write(base64.b64decode(b64_data))
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print("Successfully received perfect Item 3 image from browser!")
            done_event.set()
        else:
            self.send_response(404)
            self.end_headers()
            
    def log_message(self, *args):
        pass

PORT = 8092
httpd = HTTPServer(('localhost', PORT), RenderHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

# HTML page with Canvas rendering Item 3 with Khmer OS Siemreap
# Table dimensions in PDF: box_x0 = 70.6, box_x1 = 574.9 (w = 504.3 pt), box_y0 = 55.0, box_y1 = 135.0 (h = 80.0 pt)
# At scale 3 (1513 x 240 px)
html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @font-face {{
      font-family: 'Khmer OS Siemreap';
      src: local('Khmer OS Siemreap'), local('KhmerOSsiemreap');
    }}
    body {{
      margin: 0;
      background: #ffffff;
      font-family: 'Khmer OS Siemreap', 'Noto Sans Khmer', sans-serif;
    }}
  </style>
</head>
<body>
  <canvas id="c" width="1513" height="240"></canvas>
  <script>
    window.addEventListener('load', async () => {{
      await document.fonts.ready;
      const canvas = document.getElementById('c');
      const ctx = canvas.getContext('2d');
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale: 3x (1pt = 3px)
      // Dividers at: col1 = (241.4 - 70.6) * 3 = 170.8 * 3 = 512.4 px
      // col2 = (430.4 - 70.6) * 3 = 359.8 * 3 = 1079.4 px
      const d1 = 512;
      const d2 = 1079;
      const w = 1513;
      const h = 240;
      
      // Outer border & Dividers
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.4;
      ctx.strokeRect(1, 1, w - 2, h - 2);
      
      ctx.beginPath();
      ctx.moveTo(d1, 0); ctx.lineTo(d1, h);
      ctx.moveTo(d2, 0); ctx.lineTo(d2, h);
      ctx.stroke();
      
      ctx.fillStyle = '#000000';
      
      // Left Cell: -កត់លំហាត់លើក្តារខៀន និងឲ្យសិស្សមើលខ្លឹមបន្ត
      ctx.font = '32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
      ctx.fillText('-កត់លំហាត់លើក្តារខៀន', 30, 85);
      ctx.fillText('និងឲ្យសិស្សមើលខ្លឹមបន្ត', 30, 160);
      
      // Middle Cell: Item 3
      ctx.font = '28px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
      ctx.fillText('3. ចូររៀបចំនួនសនិទានខាងក្រោមតាមលំដាប់កើនឡើង៖', d1 + 25, 60);
      
      ctx.font = '30px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
      ctx.fillText('ក.  3/4 ,  4/5 ,  7/8 ,  0.75', d1 + 25, 125);
      ctx.fillText('ខ.  3/4 ,  5/6 ,  11/12 ,  8/9', d1 + 25, 185);
      
      // Right Cell: -ចម្លងលំហាត់ទុក
      ctx.font = '32px "Khmer OS Siemreap", "Noto Sans Khmer", sans-serif';
      ctx.fillText('-ចម្លងលំហាត់ទុក', d2 + 35, 125);
      
      // Send to server
      const b64 = canvas.toDataURL('image/png');
      await fetch('http://localhost:{PORT}/upload_item3', {{
        method: 'POST',
        headers: {{ 'Content-Type': 'text/plain' }},
        body: b64
      }});
    }});
  </script>
</body>
</html>
"""

harness_html_path = os.path.join('scratch', 'render_item3_harness.html')
with open(harness_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

url = f"http://localhost:{PORT}/scratch/render_item3_harness.html"
proc = subprocess.Popen([edge_path, "--headless=new", "--disable-gpu", "--no-sandbox", url])

ok = done_event.wait(timeout=15)
proc.kill()
httpd.shutdown()

if not ok or not os.path.exists(rendered_png):
    print("FAILED to render Item 3 image via Edge.")
    sys.exit(1)

print(f"Rendered perfect Item 3 image to {rendered_png} (size: {os.path.getsize(rendered_png)} bytes)")
