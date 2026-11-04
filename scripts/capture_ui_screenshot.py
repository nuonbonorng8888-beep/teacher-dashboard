# capture_ui_screenshot.py
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

PORT = 8095
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
<body class="bg-slate-50 p-4">
<div id="lessonPlansSection" class="max-w-6xl mx-auto"></div>
<script>
window.addEventListener('load', async () => {
  if (window.lessonPlansManager) {
    window.lessonPlansManager.init();
    // Filter to Lesson 2 to showcase it
    setTimeout(() => {
      window.lessonPlansManager.setChapterFilter('g8_l2');
      fetch('/done', { method: 'POST', body: 'done' });
    }, 1200);
  }
});
</script>
</body>
</html>"""

with open('ui_preview.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--window-size=1280,1024",
    f"--screenshot=C:\\Users\\LENOVO\\.gemini\\antigravity\\brain\\f1e067a4-40af-4458-9768-938ce551f866\\ui_lesson2_and_scheduler_preview.png",
    f"http://localhost:{PORT}/ui_preview.html"
]

print("Launching Edge to capture screenshot...")
proc = subprocess.Popen(cmd)
done_event.wait(timeout=10)
time.sleep(2)
proc.terminate()

if os.path.exists('ui_preview.html'):
    try: os.remove('ui_preview.html')
    except: pass

print("Screenshot captured successfully!")

