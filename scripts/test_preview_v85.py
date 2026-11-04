import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_merged_pdf = os.path.join(artifacts_dir, "test_preview_v85.pdf")

received = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/upload_preview':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            with open(saved_merged_pdf, 'wb') as f:
                f.write(post_data)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
            print(f"Received Preview PDF ({len(post_data)} bytes)")
            received.set()
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8099
httpd = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
print(f"Server started on http://localhost:{PORT}")

html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=8.5"></script>
<script src="/js/lesson-plans.js?v=8.5"></script>
<script>
async function run() {{
  const mgr = window.lessonPlansManager;
  mgr.init();

  try {{
    // Test target plans: Lesson 1, Lesson 2 (Letter & A4), Lesson 3 (A4), Lesson 12
    const targetIds = ['plan_g8_1', 'plan_g8_l2_1', 'plan_g8_l2_5', 'plan_g8_l3_1', 'plan_g8_38'];
    const selectedPlans = mgr.plans.filter(p => targetIds.includes(p.id));
    console.log('Selected plans for test:', selectedPlans.map(p => p.id));
    
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '8NGS_B2';

    const mergedDoc = await PDFLib.PDFDocument.create();

    for (let i = 0; i < selectedPlans.length; i++) {{
      const p = selectedPlans[i];
      p.teacher = 'ថោង សុភារី';
      p.class_name = '8NGS_B2';
      p.date_khmer = (p.id === 'plan_g8_l2_5') ? 'ថ្ងៃចន្ទ ទី២ ខែវិច្ឆិកា ឆ្នាំ២០២៦' : 'ថ្ងៃច័ន្ទ ទី១៩ ខែតុលា ឆ្នាំ២០២៦';
      
      console.log('Fetching', p.pdf_file);
      const res = await fetch('/' + encodeURI(p.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), {{ ignoreEncryption: true }});
      await mgr.applyPdfCustomStamps(doc, p);

      const copied = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copied.forEach(page => mergedDoc.addPage(page));

      // Duplex check: ensure next plan starts on an odd page
      if (i < selectedPlans.length - 1 && mergedDoc.getPageCount() % 2 === 1) {{
        mergedDoc.addPage([copied[0].getWidth(), copied[0].getHeight()]);
      }}
    }}

    const pdfBytes = await mergedDoc.save();
    console.log('Finished merging PDF, byte length:', pdfBytes.length);

    await fetch('/upload_preview', {{
      method: 'POST',
      body: pdfBytes,
      headers: {{ 'Content-Type': 'application/pdf' }}
    }});
    console.log('Uploaded successfully!');
  }} catch (err) {{
    console.error('Error in run():', err);
  }}
}}
window.onload = run;
</script>
</body>
</html>
"""

test_html_path = "scratch/test_runner_v85.html"
with open(test_html_path, "w", encoding="utf-8") as f:
    f.write(html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    f"http://localhost:{PORT}/{test_html_path}"
]

print("Launching Edge headless...")
proc = subprocess.Popen(cmd)

if not received.wait(timeout=35):
    print("Timed out waiting for merged PDF!")
    proc.kill()
    sys.exit(1)

proc.kill()
print("Edge finished, verifying generated PDF...")

# Open generated PDF with PyMuPDF
doc = pymupdf.open(saved_merged_pdf)
print(f"Merged PDF total pages: {len(doc)}")

# Render key pages:
# Plan 1: Page 0 (Cover)
pix0 = doc[0].get_pixmap(dpi=150, clip=pymupdf.Rect(0, 0, doc[0].rect.width, 240))
pix0.save(os.path.join(artifacts_dir, "v85_verified_8_1_1_cover.png"))

# Plan 2 (8_2_1): find where it starts
current_page = 0
for i, pid in enumerate(['plan_g8_1', 'plan_g8_l2_1', 'plan_g8_l2_5', 'plan_g8_l3_1', 'plan_g8_38']):
    # Find page
    p = doc[current_page]
    pix = p.get_pixmap(dpi=150, clip=pymupdf.Rect(0, 0, p.rect.width, 240))
    out_name = f"v85_verified_{pid}_cover.png"
    pix.save(os.path.join(artifacts_dir, out_name))
    print(f"Rendered {out_name} from Page {current_page} (size: {p.rect.width:.1f}x{p.rect.height:.1f})")
    
    # Estimate pages for this plan
    # 8_1_1 has 5 pages + 1 blank = 6 pages
    if pid == 'plan_g8_1': current_page += 6
    elif pid == 'plan_g8_l2_1': current_page += 6
    elif pid == 'plan_g8_l2_5': current_page += 6
    elif pid == 'plan_g8_l3_1': current_page += 6
    else: current_page += 6
    if current_page >= len(doc):
        break

print("All verifications rendered successfully into artifacts directory!")
httpd.shutdown()

