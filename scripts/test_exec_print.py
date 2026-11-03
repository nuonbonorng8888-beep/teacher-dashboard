# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys, os
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
            logs.append(post_data)
            print("BROWSER LOG:", post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        elif self.path == '/done':
            done_event.set()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8099
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="status">Ready</div>
<script src="js/pdf-lib.min.js"></script>
<script src="js/lesson-plans-data.js?v=7.9"></script>
<script src="js/lesson-plans.js?v=7.9"></script>
<script>
async function postLog(msg) {
  await fetch('/log', { method: 'POST', body: String(msg) });
}
window.onerror = function(m, u, l) { postLog('WINDOW ERROR: ' + m + ' at ' + l); };

async function test() {
  try {
    const mgr = window.lessonPlansManager;
    mgr.selectedGrade = 'ថ្នាក់ទី ៨';
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '8NGS_B2';
    mgr.savedStartDate = '2026-11-05';
    mgr.savedCadence = '2_days_skip_weekend';

    postLog('Testing executePrint for single chapter g8_l1...');
    // Intercept window.open
    window.open = function(url) {
      postLog('window.open intercepted with URL: ' + (url ? url.substring(0, 30) : 'null'));
      fetch('/done', { method: 'POST', body: 'done' });
      return {};
    };

    mgr.executePrint('single', 'g8_l1');
  } catch(e) {
    postLog('CATCH: ' + e.message);
    fetch('/done', { method: 'POST', body: 'done' });
  }
}
window.addEventListener('load', test);
</script>
</body>
</html>"""

with open('test_exec_print.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    f"http://localhost:{PORT}/test_exec_print.html"
])

done_event.wait(timeout=20)
proc.terminate()
server.shutdown()
if os.path.exists('test_exec_print.html'):
    os.remove('test_exec_print.html')
print("Finished test. Total logs:", len(logs))
