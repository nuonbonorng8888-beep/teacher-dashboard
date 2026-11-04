# scripts/test_g11_and_g12_browser_merge.py
import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import fitz

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_g11_pdf = os.path.join(artifacts_dir, "test_g11_merged.pdf")
saved_g12_pdf = os.path.join(artifacts_dir, "test_g12_merged.pdf")

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_g11':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_g11_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Received Grade 11 PDF ({len(post_data)} bytes)")
        elif self.path == '/upload_g12':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_g12_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Received Grade 12 PDF ({len(post_data)} bytes)")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8094
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=8.2"></script>
<script src="/js/lesson-plans.js?v=8.2"></script>
<script>
async function run() {
  const mgr = window.lessonPlansManager;
  mgr.init();

  // 1. TEST GRADE 11 (Teacher: ថោង សុភារី -> 096 75 74 005, Class: 11NGS_P1 & 11NGS_C2)
  try {
    const g11_plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ១១').slice(0, 2);
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '11NGS_P1 & 11NGS_C2';
    
    const mergedG11 = await PDFLib.PDFDocument.create();
    for (let i = 0; i < g11_plans.length; i++) {
      const p = g11_plans[i];
      p.teacher = 'ថោង សុភារី';
      p.class_name = '11NGS_P1 & 11NGS_C2';
      p.date_khmer = 'ថ្ងៃចន្ទ ទី១៩ ខែតុលា ឆ្នាំ២០២៦';
      
      const res = await fetch('/' + encodeURI(p.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), { ignoreEncryption: true });
      await mgr.applyPdfCustomStamps(doc, p);
      
      const copied = await mergedG11.copyPages(doc, doc.getPageIndices());
      copied.forEach(page => mergedG11.addPage(page));
      
      if (i < g11_plans.length - 1 && mergedG11.getPageCount() % 2 === 1) {
        mergedG11.addPage([copied[0].getWidth(), copied[0].getHeight()]);
      }
    }
    const g11Bytes = await mergedG11.save();
    await fetch('/upload_g11', { method: 'POST', body: g11Bytes });
  } catch (err) {
    console.error('G11 test error:', err);
  }

  // 2. TEST GRADE 12 (Teacher: នួន បូណង -> 070 794 729, Class: ១២A & ១២B)
  try {
    const g12_plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ១២').slice(0, 2);
    mgr.savedTeacher = 'នួន បូណង';
    mgr.savedClass = '១២A & ១២B';
    
    const mergedG12 = await PDFLib.PDFDocument.create();
    for (let i = 0; i < g12_plans.length; i++) {
      const p = g12_plans[i];
      p.teacher = 'នួន បូណង';
      p.class_name = '១២A & ១២B';
      p.date_khmer = 'ថ្ងៃចន្ទ ទី១៩ ខែតុលា ឆ្នាំ២០២៦';
      
      const res = await fetch('/' + encodeURI(p.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), { ignoreEncryption: true });
      await mgr.applyPdfCustomStamps(doc, p);
      
      const copied = await mergedG12.copyPages(doc, doc.getPageIndices());
      copied.forEach(page => mergedG12.addPage(page));
      
      if (i < g12_plans.length - 1 && mergedG12.getPageCount() % 2 === 1) {
        mergedG12.addPage([copied[0].getWidth(), copied[0].getHeight()]);
      }
    }
    const g12Bytes = await mergedG12.save();
    await fetch('/upload_g12', { method: 'POST', body: g12Bytes });
  } catch (err) {
    console.error('G12 test error:', err);
  }

  document.body.innerText = 'TESTS_DONE';
}
window.addEventListener('load', run);
</script>
</body>
</html>"""

os.makedirs('scratch', exist_ok=True)
with open('scratch/test_browser_merge_run.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=12000",
    f"http://localhost:{PORT}/scratch/test_browser_merge_run.html"
]

print("Running Edge browser test for G11 and G12 merging...")
subprocess.run(cmd, capture_output=True)

server.shutdown()

print(f"G11 PDF exists: {os.path.exists(saved_g11_pdf)}")
print(f"G12 PDF exists: {os.path.exists(saved_g12_pdf)}")

if os.path.exists(saved_g11_pdf):
    doc11 = fitz.open(saved_g11_pdf)
    print(f"G11 Merged PDF total pages: {len(doc11)}")
    p0 = doc11[0]
    pix = p0.get_pixmap(dpi=150)
    pix.save(os.path.join(artifacts_dir, "browser_stamped_g11_p0.png"))
    print("Saved browser_stamped_g11_p0.png")

if os.path.exists(saved_g12_pdf):
    doc12 = fitz.open(saved_g12_pdf)
    print(f"G12 Merged PDF total pages: {len(doc12)}")
    p0 = doc12[0]
    pix = p0.get_pixmap(dpi=150)
    pix.save(os.path.join(artifacts_dir, "browser_stamped_g12_p0.png"))
    print("Saved browser_stamped_g12_p0.png")

