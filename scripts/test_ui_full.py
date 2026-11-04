# test_ui_full.py
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

PORT = 8094
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="css/style.css">
<script src="js/pdf-lib.min.js"></script>
<script src="js/lesson-plans-data.js?v=8.1"></script>
<script src="js/lesson-plans.js?v=8.1"></script>
</head>
<body class="bg-slate-100 p-4">
<div id="lessonPlansSection" class="max-w-7xl mx-auto space-y-4"></div>
<script>
window.addEventListener('DOMContentLoaded', () => {
  window.lessonPlansManager.init();
  window.lessonPlansManager.setGrade('ថ្នាក់ទី ៨');
  window.lessonPlansManager.render();
  setTimeout(() => {
    fetch('/done', { method: 'POST', body: 'done' });
  }, 1000);
});
</script>
</body>
</html>"""

with open('test_ui_render.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

# Run Edge with remote debugging to capture screenshot after rendering
cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1440,1200",
    f"--screenshot=C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\f1e067a4-40af-4458-9768-938ce551f866\\verified_lesson2_and_scheduler.png",
    f"http://localhost:{PORT}/test_ui_render.html"
]

proc = subprocess.Popen(cmd)
done_event.wait(timeout=10)
time.sleep(2)
proc.terminate()

if os.path.exists('test_ui_render.html'):
    try: os.remove('test_ui_render.html')
    except: pass

print("Done rendering screenshot!")
