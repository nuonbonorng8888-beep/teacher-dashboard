# -*- coding: utf-8 -*-
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import time
import subprocess
import fitz

sys.stdout.reconfigure(encoding='utf-8')

saved_pdf_path = "scratch/browser_stamped_8_1_1.pdf"
if os.path.exists(saved_pdf_path):
    os.remove(saved_pdf_path)

received_event = threading.Event()

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
            received_event.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # suppress request logs
        pass

server = HTTPServer(('localhost', 8089), CustomHandler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
print("Server started on port 8089")

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="status">Loading...</div>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=7.7"></script>
<script src="/js/lesson-plans.js?v=7.7"></script>
<script>
window.onerror = function(msg, url, line) {
  document.getElementById('status').innerText = 'ERROR: ' + msg + ' line: ' + line;
};
async function run() {
  try {
    const mgr = window.lessonPlansManager;
    if (!mgr) {
      document.getElementById('status').innerText = 'ERROR: lessonPlansManager is null';
      return;
    }
    const p = mgr.plans.find(x => x.id === 'plan_g8_1');
    p.class_name = '8NGS_B2';
    p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
    p.teacher = 'ថោង សុភារី';

    const res = await fetch('/' + encodeURI(p.pdf_file));
    const bytes = await res.arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });

    await mgr.applyPdfCustomStamps(doc, p);
    const modified = await doc.save();

    await fetch('/upload_pdf', {
      method: 'POST',
      body: modified,
      headers: { 'Content-Type': 'application/pdf' }
    });
    document.getElementById('status').innerText = 'DONE_UPLOAD';
  } catch (err) {
    document.getElementById('status').innerText = 'CATCH: ' + err.message;
  }
}
window.addEventListener('load', run);
</script>
</body>
</html>"""

with open('scratch/test_upload.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless",
    "--disable-gpu",
    "http://localhost:8089/scratch/test_upload.html"
])

# Wait up to 10 seconds for upload
received = received_event.wait(timeout=10)
proc.terminate()
server.shutdown()

print("Received within timeout?", received)
print("File exists?", os.path.exists(saved_pdf_path))
if os.path.exists(saved_pdf_path):
    print("Size:", os.path.getsize(saved_pdf_path))
    doc = fitz.open(saved_pdf_path)
    print("Pages in stamped PDF:", len(doc))
    # Render Cover (page 0), Page 3, Page 4
    doc[0].get_pixmap(dpi=150).save('scratch/stamped_p0.png')
    doc[3].get_pixmap(dpi=150).save('scratch/stamped_p3.png')
    doc[4].get_pixmap(dpi=150).save('scratch/stamped_p4.png')
    print("Saved preview images for p0, p3, p4!")
