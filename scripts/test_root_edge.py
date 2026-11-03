# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

saved_pdf = "scratch/final_verified_merged_root.pdf"
if os.path.exists(saved_pdf):
    os.remove(saved_pdf)

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
        elif self.path == '/save_pdf':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Successfully received {len(post_data)} bytes merged PDF!")
            done_event.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8098
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

    const plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' && p.chapter_code === 'g8_l1');
    postLog('Selected plans count: ' + plans.length);

    // Intercept URL.createObjectURL to send blob to /save_pdf
    const origCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
      postLog('createObjectURL intercepted with blob size: ' + blob.size);
      blob.arrayBuffer().then(buf => {
        fetch('/save_pdf', {
          method: 'POST',
          body: buf,
          headers: { 'Content-Type': 'application/pdf' }
        });
      });
      return origCreateObjectURL.apply(this, arguments);
    };

    postLog('Calling downloadMergedPdf...');
    await mgr.downloadMergedPdf(plans, 'test_lesson1_merged.pdf');
    postLog('downloadMergedPdf completed!');
  } catch(e) {
    postLog('CATCH: ' + e.message + ' stack: ' + e.stack);
  }
}
window.addEventListener('load', test);
</script>
</body>
</html>"""

with open('test_merged_runner.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    f"http://localhost:{PORT}/test_merged_runner.html"
])

done_event.wait(timeout=30)
proc.terminate()
server.shutdown()
if os.path.exists('test_merged_runner.html'):
    os.remove('test_merged_runner.html')

print("Saved PDF exists?", os.path.exists(saved_pdf))
if os.path.exists(saved_pdf):
    print("PDF size:", os.path.getsize(saved_pdf))
    doc = pymupdf.open(saved_pdf)
    print("Page count in merged PDF:", len(doc))
    for i in [0, 3, 4, 5, 6]:
        if i < len(doc):
            p = doc[i]
            print(f"Page {i+1} rect: {p.rect}")
