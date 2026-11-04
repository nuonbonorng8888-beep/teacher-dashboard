# debug_test.py
import subprocess, time, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

sys.stdout.reconfigure(encoding='utf-8')
logs = []
done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/log':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            print("BROWSER LOG:", post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            if 'Loaded' in post_data or 'SCRIPT ERROR' in post_data:
                done_event.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8096
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<script>
window.onerror = function(msg, url, line, col, err) {
  fetch('/log', { method: 'POST', body: 'SCRIPT ERROR: ' + msg + ' at line ' + line + ':' + col });
};
</script>
<script src="js/pdf-lib.min.js"></script>
<script src="js/lesson-plans-data.js?v=8.1"></script>
<script src="js/lesson-plans.js?v=8.1"></script>
</head>
<body>
<div id="lessonPlansSection"></div>
<script>
window.addEventListener('load', function() {
  fetch('/log', { method: 'POST', body: 'Loaded. mgr exists: ' + (typeof window.lessonPlansManager !== 'undefined') });
});
</script>
</body>
</html>"""

with open('debug_load.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
cmd = [edge_exe, "--headless", "--disable-gpu", "--no-sandbox", f"http://localhost:{PORT}/debug_load.html"]
proc = subprocess.Popen(cmd)
done_event.wait(timeout=10)
proc.terminate()
if os.path.exists('debug_load.html'):
    try: os.remove('debug_load.html')
    except: pass

