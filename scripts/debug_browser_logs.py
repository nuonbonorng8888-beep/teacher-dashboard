# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

sys.stdout.reconfigure(encoding='utf-8')

logs = []
done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode('utf-8')
        if self.path == '/log':
            logs.append(post_data)
            print("BROWSER LOG:", post_data)
        elif self.path == '/done':
            done_event.set()
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'OK')

    def log_message(self, format, *args):
        pass

server = HTTPServer(('localhost', 8096), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=7.7"></script>
<script src="/js/lesson-plans.js?v=7.7"></script>
<script>
async function postLog(msg) {
  await fetch('/log', { method: 'POST', body: String(msg) });
}
window.onerror = function(m, u, l) { postLog('WINDOW ERROR: ' + m + ' at ' + l); };
async function test() {
  try {
    const mgr = window.lessonPlansManager;
    const p = mgr.plans.find(x => x.id === 'plan_g8_1');
    p.class_name = '8NGS_B2';
    p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
    p.teacher = 'ថោង សុភារី';

    postLog('Loading PDF...');
    const res = await fetch(p.pdf_file);
    const bytes = await res.arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });

    postLog('Doc loaded, page count: ' + doc.getPageCount());
    await mgr.applyPdfCustomStamps(doc, p);
    postLog('applyPdfCustomStamps finished cleanly!');
  } catch(e) {
    postLog('CATCH: ' + e.message + ' stack: ' + e.stack);
  } finally {
    await fetch('/done', { method: 'POST', body: 'done' });
  }
}
window.addEventListener('load', test);
</script>
</body>
</html>"""

with open('scratch/test_logs.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    "http://localhost:8096/scratch/test_logs.html"
])

done_event.wait(timeout=10)
proc.terminate()
server.shutdown()
print("Done. Total logs:", len(logs))
