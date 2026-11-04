# scripts/capture_g11_and_g12_screenshots.py
import subprocess, time, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

sys.stdout.reconfigure(encoding='utf-8')
done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/done':
            done_event.set()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8098
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

def capture(mode, filename):
    done_event.clear()
    html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="css/style.css">
<script src="js/pdf-lib.min.js"></script>
<script src="js/lesson-plans-data.js?v=8.2"></script>
<script src="js/lesson-plans.js?v=8.2"></script>
</head>
<body class="bg-slate-50 p-4">
<div id="lessonPlansSection" class="max-w-7xl mx-auto space-y-4"></div>
<script>
window.addEventListener('DOMContentLoaded', () => {{
  window.lessonPlansManager.init();
  if ('{mode}' === 'g11') {{
    window.lessonPlansManager.setGrade('ថ្នាក់ទី ១១');
    setTimeout(() => {{
      fetch('/done', {{ method: 'POST', body: 'done' }});
    }}, 800);
  }} else if ('{mode}' === 'g12') {{
    window.lessonPlansManager.setGrade('ថ្នាក់ទី ១២');
    setTimeout(() => {{
      fetch('/done', {{ method: 'POST', body: 'done' }});
    }}, 800);
  }} else if ('{mode}' === 'g11_printhub') {{
    window.lessonPlansManager.setGrade('ថ្នាក់ទី ១១');
    setTimeout(() => {{
      window.lessonPlansManager.openPrintHub('multiple');
      setTimeout(() => {{
        fetch('/done', {{ method: 'POST', body: 'done' }});
      }}, 800);
    }}, 500);
  }}
}});
</script>
</body>
</html>"""
    
    with open('test_capture_temp.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
    
    out_path = os.path.join(r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866", filename)
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1280,1050",
        f"--screenshot={out_path}",
        f"http://localhost:{PORT}/test_capture_temp.html"
    ]
    proc = subprocess.Popen(cmd)
    done_event.wait(timeout=10)
    time.sleep(2)
    proc.terminate()
    print(f"Captured: {filename}")

capture('g11', 'verified_grade11_ui.png')
capture('g12', 'verified_grade12_ui.png')
capture('g11_printhub', 'verified_grade11_printhub.png')

if os.path.exists('test_capture_temp.html'):
    try: os.remove('test_capture_temp.html')
    except: pass

print("All screenshots captured successfully!")

