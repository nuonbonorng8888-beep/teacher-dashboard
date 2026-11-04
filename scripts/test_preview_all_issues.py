# scripts/test_preview_all_issues.py
import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import pymupdf

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
saved_merged_pdf = os.path.join(artifacts_dir, "test_preview_fixed.pdf")

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

PORT = 8098
httpd = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
print(f"Server started on http://localhost:{PORT}")

html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=8.4"></script>
<script src="/js/lesson-plans.js?v=8.4"></script>
<script>
async function run() {{
  const mgr = window.lessonPlansManager;
  mgr.init();

  try {{
    // Test target plans
    const targetIds = ['plan_g8_1', 'plan_g8_6', 'plan_g8_38', 'plan_g8_35'];
    const selectedPlans = mgr.plans.filter(p => targetIds.includes(p.id));
    console.log('Selected plans for test:', selectedPlans.map(p => p.id));
    
    mgr.savedTeacher = 'ថោង សុភារី';
    mgr.savedClass = '8NGS_B2';

    const mergedDoc = await PDFLib.PDFDocument.create();

    for (let i = 0; i < selectedPlans.length; i++) {{
      const p = selectedPlans[i];
      p.teacher = 'ថោង សុភារី';
      p.class_name = '8NGS_B2';
      p.date_khmer = 'ថ្ងៃពុធ ទី២៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
      
      console.log('Fetching', p.pdf_file);
      const res = await fetch('/' + encodeURI(p.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), {{ ignoreEncryption: true }});
      await mgr.applyPdfCustomStamps(doc, p);

      const copied = await mergedDoc.copyPages(doc, doc.getPageIndices());
      copied.forEach(page => mergedDoc.addPage(page));

      if (i < selectedPlans.length - 1 && mergedDoc.getPageCount() % 2 === 1) {{
        mergedDoc.addPage([copied[0].getWidth(), copied[0].getHeight()]);
      }}
    }}

    const pdfBytes = await mergedDoc.save();
    console.log('Uploading PDF (' + pdfBytes.byteLength + ' bytes)');
    await fetch('/upload_preview', {{ method: 'POST', body: pdfBytes }});
  }} catch (err) {{
    console.error('Test error:', err);
  }}

  document.body.innerText = 'TEST_DONE';
}}
window.addEventListener('load', run);
</script>
</body>
</html>"""

harness_path = os.path.join('scratch', 'test_preview_harness.html')
os.makedirs('scratch', exist_ok=True)
with open(harness_path, 'w', encoding='utf-8') as f:
    f.write(html)

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

url = f"http://localhost:{PORT}/scratch/test_preview_harness.html"
cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--allow-file-access-from-files",
    url
]
print("Launching Edge to generate and verify PDF...")
proc = subprocess.Popen(cmd)

ok = received.wait(timeout=30)
proc.kill()
httpd.shutdown()

if not ok:
    print("FAILED: Did not receive preview PDF within 30 seconds.")
    sys.exit(1)

print(f"SUCCESS: Preview PDF saved to {saved_merged_pdf}!")

# Now inspect pages in PyMuPDF
doc = pymupdf.open(saved_merged_pdf)
print(f"Total pages in merged PDF: {len(doc)}")

# Render key verification pages:
for p_no in range(len(doc)):
    page = doc[p_no]
    text = page.get_text()
    
    # 1. Check 8_1_1 Item 3 + Signatures
    if '3. ចូររៀបចំនួនសនិទាន' in text or 'ចូររៀបចំនួនសនិទាន' in text:
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, "verified_fixed_8_1_1_item3.png")
        pix.save(out_p)
        print(f"Rendered verified_fixed_8_1_1_item3.png (Page {p_no+1})")
        
    # 2. Check 8_12_1 Cover page
    if 'េមេរៀនទី១២' in text and ('ថនក់ទី' in text or 'ថ្នាក់ទី' in text):
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, "verified_fixed_8_12_1_cover.png")
        pix.save(out_p)
        print(f"Rendered verified_fixed_8_12_1_cover.png (Page {p_no+1})")
        
    # 3. Check 8_12_1 Signature page (was Image 3)
    if 'បណតំេផញ' in text or 'បណ្តាំផ្ញើ' in text:
        if 'បនេឃញ' in text or 'បានឃើញ' in text:
            pix = page.get_pixmap(dpi=150)
            out_p = os.path.join(artifacts_dir, "verified_fixed_8_12_1_sig_page.png")
            pix.save(out_p)
            print(f"Rendered verified_fixed_8_12_1_sig_page.png (Page {p_no+1})")

    # 4. Check 8_3_2 Exercise + Signatures
    if '75000$' in text or '75 000 $' in text:
        pix = page.get_pixmap(dpi=150)
        out_p = os.path.join(artifacts_dir, "verified_fixed_8_3_2_page.png")
        pix.save(out_p)
        print(f"Rendered verified_fixed_8_3_2_page.png (Page {p_no+1})")

print("\nAll verification pages successfully rendered!")

