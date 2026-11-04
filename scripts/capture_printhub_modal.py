# capture_printhub_modal.py
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

PORT = 8091
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
<body class="bg-slate-900/60 p-4">
<div id="lessonPlansSection" class="max-w-7xl mx-auto space-y-4"></div>
<script>
window.addEventListener('DOMContentLoaded', () => {
  window.lessonPlansManager.init();
  window.lessonPlansManager.setGrade('ថ្នាក់ទី ៨');
  window.lessonPlansManager.render();
  setTimeout(() => {
    // Open Print Hub on 'multiple' tab
    window.lessonPlansManager.openPrintHub('multiple');
    // Select Lesson 1, Lesson 2, Lesson 3, and Lesson 12
    window.lessonPlansManager.togglePrintHubChapter('g8_l1');
    window.lessonPlansManager.togglePrintHubChapter('g8_l2');
    window.lessonPlansManager.togglePrintHubChapter('g8_l3');
    window.lessonPlansManager.togglePrintHubChapter('g8_l12');
    setTimeout(() => {
      fetch('/done', { method: 'POST', body: 'done' });
    }, 800);
  }, 1000);
});
</script>
</body>
</html>"""

with open('test_printhub_render.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
screenshot_path = os.path.join(artifacts_dir, "how_to_select_multiple_lessons.png")

cmd = [
    edge_exe,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1280,1050",
    f"--screenshot={screenshot_path}",
    f"http://localhost:{PORT}/test_printhub_render.html"
]

proc = subprocess.Popen(cmd)
done_event.wait(timeout=10)
time.sleep(2)
proc.terminate()

if os.path.exists('test_printhub_render.html'):
    try: os.remove('test_printhub_render.html')
    except: pass

print("Screenshot created:", os.path.exists(screenshot_path))

