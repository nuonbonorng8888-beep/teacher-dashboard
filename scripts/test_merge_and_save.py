# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import fitz

sys.stdout.reconfigure(encoding='utf-8')

saved_pdf = "scratch/final_verified_merged.pdf"
if os.path.exists(saved_pdf):
    os.remove(saved_pdf)

done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save_pdf':
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

server = HTTPServer(('localhost', 8091), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

# Create a test page that loads index scripts
html = """<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="/css/style.css?v=7.8">
</head>
<body>
  <div id="status">Starting...</div>
  <script src="/js/pdf-lib.min.js"></script>
  <script src="/js/lesson-plans-data.js?v=7.8"></script>
  <script src="/js/lesson-plans.js?v=7.8"></script>
  <script>
  async function run() {
    try {
      const mgr = window.lessonPlansManager;
      mgr.selectedGrade = 'ថ្នាក់ទី ៨';
      mgr.savedTeacher = 'ថោង សុភារី';
      mgr.savedClass = '8NGS_B2';
      mgr.savedStartDate = '2026-11-05';
      mgr.savedCadence = '2_days_skip_weekend';

      const plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' && p.chapter_code === 'g8_l1');
      document.getElementById('status').innerText = 'Plans: ' + plans.length;

      // Intercept URL.createObjectURL or link click to send to /save_pdf
      const origCreateObjectURL = URL.createObjectURL;
      URL.createObjectURL = function(blob) {
        blob.arrayBuffer().then(buf => {
          fetch('/save_pdf', {
            method: 'POST',
            body: buf,
            headers: { 'Content-Type': 'application/pdf' }
          });
        });
        return origCreateObjectURL.apply(this, arguments);
      };

      await mgr.downloadMergedPdf(plans, 'test_merged');
      document.getElementById('status').innerText = 'DOWNLOAD_CALLED';
    } catch(err) {
      document.getElementById('status').innerText = 'ERROR: ' + err.message;
    }
  }
  window.addEventListener('load', () => setTimeout(run, 500));
  </script>
</body>
</html>"""

with open('scratch/test_runner.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    "http://localhost:8091/scratch/test_runner.html"
])

done_event.wait(timeout=25)
proc.terminate()
server.shutdown()

print("File exists?", os.path.exists(saved_pdf))
if os.path.exists(saved_pdf):
    print("Size:", os.path.getsize(saved_pdf))
    doc = fitz.open(saved_pdf)
    print("Page count:", len(doc))
    # Render Page 4 and Page 5
    doc[3].get_pixmap(dpi=150).save('scratch/merged_p4_verified.png')
    doc[4].get_pixmap(dpi=150).save('scratch/merged_p5_verified.png')
    print("Saved merged_p4_verified.png and merged_p5_verified.png!")

