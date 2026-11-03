# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import fitz

sys.stdout.reconfigure(encoding='utf-8')

merged_out = "scratch/test_merged_v78.pdf"
if os.path.exists(merged_out):
    os.remove(merged_out)

done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_merged':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(merged_out, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Server: received {len(post_data)} bytes merged PDF!")
            done_event.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Do not print to stderr to avoid cp1252 UnicodeEncodeError
        pass

server = HTTPServer(('localhost', 8092), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

# Load index.html in Edge with automated test script injected
test_script = """
<script>
window.addEventListener('load', async () => {
  try {
    const mgr = window.lessonPlansManager;
    mgr.selectedGrade = 'ថ្នាក់ទី ៨';
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '8NGS_B2';
    mgr.savedStartDate = '2026-11-05';
    mgr.savedCadence = '2_days_skip_weekend';

    // Get all plans for Lesson 1 (g8_l1)
    const plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' && p.chapter_code === 'g8_l1');
    console.log('Plans to merge:', plans.length);

    // Call mgr.downloadMergedPdf directly, intercepting download
    const origCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
      blob.arrayBuffer().then(buf => {
        fetch('/upload_merged', {
          method: 'POST',
          body: buf,
          headers: { 'Content-Type': 'application/pdf' }
        });
      });
      return origCreateObjectURL.apply(this, arguments);
    };

    await mgr.downloadMergedPdf(plans, 'test_merged');
    console.log('downloadMergedPdf completed!');
  } catch(e) {
    console.error('ERROR:', e);
  }
});
</script>
"""

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('</body>', test_script + '</body>')

with open('scratch/test_merged_run.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    "http://localhost:8092/scratch/test_merged_run.html"
])

done_event.wait(timeout=25)
proc.terminate()
server.shutdown()

print("Merged file exists?", os.path.exists(merged_out))
if os.path.exists(merged_out):
    print("Size:", os.path.getsize(merged_out))
    doc = fitz.open(merged_out)
    print("Total pages in merged PDF:", len(doc))
    for i in range(len(doc)):
        pix = doc[i].get_pixmap(dpi=100)
        pix.save(f'scratch/merged_page_{i+1}.png')
    print("Rendered all merged page previews!")

    # Check dates on page 1, 7, 11, 17, 21
    key_pages = [0, 6, 10, 16, 20]
    for idx, p_idx in enumerate(key_pages):
        if p_idx < len(doc):
            text = doc[p_idx].get_text()
            for line in text.splitlines():
                if 'ថ្ងៃ' in line or 'កាលបរិច្ឆេទ' in line:
                    print(f"Plan {idx+1} (Page {p_idx+1}): {line.strip()}")
