# scripts/test_g8_browser_merge.py
import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_g8_pdf = os.path.join(artifacts_dir, "test_g8_fixed_merged.pdf")

received = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_g8':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_g8_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Received Grade 8 Merged PDF ({len(post_data)} bytes)")
            received.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8097
httpd = HTTPServer(('localhost', PORT), CustomHandler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
print(f"HTTP Server started on http://localhost:{PORT}")

html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=8.3"></script>
<script src="/js/lesson-plans.js?v=8.3"></script>
<script>
async function run() {{
  const mgr = window.lessonPlansManager;
  mgr.init();

  try {{
    const targetIds = ['plan_g8_1', 'plan_g8_6', 'plan_g8_35'];
    const selectedPlans = mgr.plans.filter(p => targetIds.includes(p.id));
    console.log('Selected plans for test:', selectedPlans.map(p => p.id));
    
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '8NGS_B2';

    const mergedG8 = await PDFLib.PDFDocument.create();

    for (let i = 0; i < selectedPlans.length; i++) {{
      const p = selectedPlans[i];
      p.teacher = 'ថោង សុភារី';
      p.class_name = '8NGS_B2';
      p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
      
      console.log('Fetching', p.pdf_file);
      const res = await fetch('/' + encodeURI(p.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), {{ ignoreEncryption: true }});
      await mgr.applyPdfCustomStamps(doc, p);

      const copied = await mergedG8.copyPages(doc, doc.getPageIndices());
      copied.forEach(page => mergedG8.addPage(page));

      if (i < selectedPlans.length - 1 && mergedG8.getPageCount() % 2 === 1) {{
        mergedG8.addPage([copied[0].getWidth(), copied[0].getHeight()]);
      }}
    }}

    const g8Bytes = await mergedG8.save();
    console.log('Uploading Grade 8 PDF (' + g8Bytes.byteLength + ' bytes)');
    await fetch('/upload_g8', {{ method: 'POST', body: g8Bytes }});
  }} catch (err) {{
    console.error('Grade 8 test error:', err);
  }}

  document.body.innerText = 'TEST_DONE';
}}
window.addEventListener('load', run);
</script>
</body>
</html>"""

harness_path = os.path.join('scratch', 'test_g8_harness.html')
os.makedirs('scratch', exist_ok=True)
with open(harness_path, 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

url = f"http://localhost:{PORT}/scratch/test_g8_harness.html"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--allow-file-access-from-files",
    url
]
print("Launching Edge...")
proc = subprocess.Popen(cmd)

ok = received.wait(timeout=25)
proc.kill()
httpd.shutdown()

if not ok:
    print("FAILED: Did not receive Grade 8 PDF within 25 seconds.")
    sys.exit(1)

print(f"SUCCESS: Grade 8 PDF saved to {saved_g8_pdf}!")

# Inspect and render images
doc = pymupdf.open(saved_g8_pdf)
print(f"Total pages in merged Grade 8 PDF: {len(doc)}")

# Render key verification pages:
for p_no in range(len(doc)):
    page = doc[p_no]
    text = page.get_text()
    
    # Check 8_1_1
    if '3. ចូររៀបចំនួនសនិទាន' in text or 'ចូររៀបចំនួនសនិទាន' in text:
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, f"verified_g8_8_1_1_page_{p_no+1}.png")
        pix.save(out_p)
        print(f"Rendered 8_1_1 Item 3 + Signatures page -> {out_p}")
        
    # Check 8_3_2
    if '75000$' in text or '75 000 $' in text:
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, f"verified_g8_8_3_2_exercise_page_{p_no+1}.png")
        pix.save(out_p)
        print(f"Rendered 8_3_2 Exercise + Signatures page -> {out_p}")
        
    # Check 8_10_3
    if 'ចូរសង់ក្រកាប' in text:
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, f"verified_g8_8_10_3_exercise_page_{p_no+1}.png")
        pix.save(out_p)
        print(f"Rendered 8_10_3 Exercise + Signatures page -> {out_p}")

print("\n--- Edge Browser Verification Complete! ---")
