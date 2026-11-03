# -*- coding: utf-8 -*-
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time
import subprocess

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_pdf_path = os.path.join(artifacts_dir, "browser_stamped_8_1_1.pdf")

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_pdf':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_pdf_path, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Successfully received and saved {len(post_data)} bytes PDF!")
        else:
            self.send_response(404)
            self.end_headers()

server = HTTPServer(('localhost', 8088), CustomHandler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
print("Server started on port 8088")

# Write HTML that posts the stamped PDF to /upload_pdf
html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=7.2"></script>
<script src="/js/lesson-plans.js?v=7.2"></script>
<script>
async function run() {
  const mgr = window.lessonPlansManager;
  const p = mgr.plans.find(x => x.id === 'plan_g8_1');
  p.class_name = '8NGS_B2';
  p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
  p.teacher = 'នួន បូណង';

  const res = await fetch('/' + p.pdf_file);
  const bytes = await res.arrayBuffer();
  const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });

  await mgr.applyPdfCustomStamps(doc, p);
  const modified = await doc.save();

  await fetch('/upload_pdf', {
    method: 'POST',
    body: modified,
    headers: { 'Content-Type': 'application/pdf' }
  });
  document.body.innerText = 'DONE_UPLOAD';
}
window.addEventListener('load', run);
</script>
</body>
</html>"""

with open('scratch/test_upload.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge,
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=4000",
    "http://localhost:8088/scratch/test_upload.html"
]
subprocess.run(cmd, capture_output=True)

server.shutdown()
print("File exists?", os.path.exists(saved_pdf_path))
if os.path.exists(saved_pdf_path):
    print("Size:", os.path.getsize(saved_pdf_path))

