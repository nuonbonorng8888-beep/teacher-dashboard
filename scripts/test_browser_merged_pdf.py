# -*- coding: utf-8 -*-
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading
import subprocess
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_merged_pdf = os.path.join(artifacts_dir, "test_merged_v75.pdf")

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_merged':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_merged_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Successfully received and saved merged PDF: {len(post_data)} bytes!")
        else:
            self.send_response(404)
            self.end_headers()

server = HTTPServer(('localhost', 8095), CustomHandler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
print("Server started on port 8095")

# Test HTML that executes downloadMergedPdf logic
html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=7.5"></script>
<script src="/js/lesson-plans.js?v=7.5"></script>
<script>
async function run() {
  const mgr = window.lessonPlansManager;
  // Get all 5 plans for Grade 8, Lesson 1
  const plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨' && p.chapter && p.chapter.includes('ចំនួនសនិទាន'));
  console.log('Found plans for merge:', plans.length);

  // Set custom class and teacher
  mgr.savedClass = '8NGS_B2';
  mgr.savedTeacher = 'នួន បូណង';

  // Override download to post back to server
  const origSave = PDFLib.PDFDocument.prototype.save;
  
  // We can merge directly using mergedPdf
  const mergedPdf = await PDFLib.PDFDocument.create();
  let successfulCount = 0;

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    plan.class_name = '8NGS_B2';
    plan.teacher = 'នួន បូណង';
    
    const res = await fetch('/' + plan.pdf_file);
    const pdfBytes = await res.arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    await mgr.applyPdfCustomStamps(doc, plan);

    const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
    copiedPages.forEach(p => mergedPdf.addPage(p));
    successfulCount++;

    if (i < plans.length - 1) {
      const currentTotalPages = mergedPdf.getPageCount();
      if (currentTotalPages % 2 === 1) {
        const firstPage = copiedPages[0];
        const pWidth = firstPage ? firstPage.getWidth() : 612.0;
        const pHeight = firstPage ? firstPage.getHeight() : 792.0;
        mergedPdf.addPage([pWidth, pHeight]);
      }
    }
  }

  const mergedBytes = await mergedPdf.save();
  await fetch('/upload_merged', {
    method: 'POST',
    body: mergedBytes,
    headers: { 'Content-Type': 'application/pdf' }
  });
  document.body.innerText = 'DONE_MERGE_UPLOAD';
}
window.addEventListener('load', run);
</script>
</body>
</html>"""

with open('scratch/test_merged_upload.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge,
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=6000",
    "http://localhost:8095/scratch/test_merged_upload.html"
]
subprocess.run(cmd, capture_output=True)

server.shutdown()
print("Merged PDF exists?", os.path.exists(saved_merged_pdf))
if os.path.exists(saved_merged_pdf):
    print("Size:", os.path.getsize(saved_merged_pdf))
    doc = fitz.open(saved_merged_pdf)
    print("Merged PDF total pages:", len(doc))
