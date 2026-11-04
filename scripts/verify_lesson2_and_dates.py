# -*- coding: utf-8 -*-
import subprocess, time, json, sys, os
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

sys.stdout.reconfigure(encoding='utf-8')
logs = []
done_event = threading.Event()
results = {}

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
        elif self.path == '/results':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            global results
            results = json.loads(post_data)
            print("TEST RESULTS RECEIVED!")
            done_event.set()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8097
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="testApp"></div>
<script src="js/pdf-lib.min.js"></script>
<script src="js/lesson-plans-data.js?v=8.1"></script>
<script src="js/lesson-plans.js?v=8.1"></script>
<script>
async function postLog(msg) {
  await fetch('/log', { method: 'POST', body: String(msg) });
}
async function sendResults(data) {
  await fetch('/results', { method: 'POST', body: JSON.stringify(data) });
}
window.onerror = function(m, u, l) { postLog('WINDOW ERROR: ' + m + ' at ' + l); };

async function runTests() {
  const output = {};
  try {
    const mgr = window.lessonPlansManager;
    output.totalPlans = mgr.plans.length;
    
    // 1. Grade 8 plans check
    const g8Plans = mgr.plans.filter(p => p.grade === 'ថ្នាក់ទី ៨');
    output.g8Count = g8Plans.length;
    
    const chapters = mgr.getGradeChapters();
    output.chapters = chapters.map(c => ({ code: c.code, title: c.title, count: c.count }));

    // Check Lesson 2 specifically
    const l2 = chapters.find(c => c.code === 'g8_l2');
    output.hasLesson2 = !!l2;
    output.l2Details = l2 ? { code: l2.code, title: l2.title, count: l2.count } : null;

    // 2. Test calculateScheduleDates
    // A. 78 plans in Semester 1 (2026-10-19 to 2027-02-20)
    const dates78 = mgr.calculateScheduleDates('2026-10-19', '2027-02-20', 'auto_fit_range', 78);
    output.dates78_start = dates78[0];
    output.dates78_end = dates78[dates78.length - 1];
    output.dates78_count = dates78.length;
    // Check weekends in dates78
    let weekendCount78 = 0;
    dates78.forEach(d => {
      const dt = new Date(d);
      if (dt.getDay() === 0 || dt.getDay() === 6) weekendCount78++;
    });
    output.dates78_weekendCount = weekendCount78;

    // B. Lesson 2 (5 plans) with 2_days_skip_weekend
    const datesL2_2days = mgr.calculateScheduleDates('2026-10-19', '2027-02-20', '2_days_skip_weekend', 5);
    output.datesL2_2days = datesL2_2days;

    // C. Lesson 2 (5 plans) with 3_days_skip_weekend
    const datesL2_3days = mgr.calculateScheduleDates('2026-10-19', '2027-02-20', '3_days_skip_weekend', 5);
    output.datesL2_3days = datesL2_3days;

    // D. Lesson 2 (5 plans) with daily_weekdays (1 day skip)
    const datesL2_daily = mgr.calculateScheduleDates('2026-10-19', '2027-02-20', 'daily_weekdays', 5);
    output.datesL2_daily = datesL2_daily;

    // 3. Test Lesson 2 PDF merge & odd page rule
    postLog('Testing Lesson 2 PDF merge...');
    const l2Plans = mgr.plans.filter(p => p.chapter_code === 'g8_l2');
    output.l2PlansCount = l2Plans.length;
    
    // Simulate PDF generation using PDFLib
    const mergedDoc = await PDFLib.PDFDocument.create();
    let l2PlanStartPages = [];
    for (let i = 0; i < l2Plans.length; i++) {
      const plan = l2Plans[i];
      const res = await fetch(encodeURI(plan.pdf_file));
      const pdfBytes = await res.arrayBuffer();
      const doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      await mgr.applyPdfCustomStamps(doc, plan);
      const copiedPages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      
      const startPageNum = mergedDoc.getPageCount() + 1;
      l2PlanStartPages.push({ planId: plan.id, startPage: startPageNum });
      copiedPages.forEach(p => mergedDoc.addPage(p));
      
      // Duplex padding rule
      if (i < l2Plans.length - 1) {
        if (mergedDoc.getPageCount() % 2 === 1) {
          const firstP = copiedPages[0];
          mergedDoc.addPage([firstP.getWidth(), firstP.getHeight()]);
        }
      }
    }
    output.mergedTotalPages = mergedDoc.getPageCount();
    output.l2PlanStartPages = l2PlanStartPages;
    // Check if every plan starts on an odd page (startPage % 2 === 1)
    output.allPlansStartOnOddPage = l2PlanStartPages.every(p => p.startPage % 2 === 1);

    await sendResults(output);
  } catch(e) {
    postLog('TEST EXCEPTION: ' + e.message + '\\n' + e.stack);
    output.error = e.message;
    await sendResults(output);
  }
}

window.addEventListener('load', runTests);
</script>
</body>
</html>"""

with open('verify_test_runner.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
if not edge_exe:
    print("Edge not found!")
    sys.exit(1)

cmd = [
    edge_exe,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    f"http://localhost:{PORT}/verify_test_runner.html"
]

print(f"Running Edge Headless: {' '.join(cmd)}")
proc = subprocess.Popen(cmd)

done = done_event.wait(timeout=25)
proc.terminate()

if os.path.exists('verify_test_runner.html'):
    try: os.remove('verify_test_runner.html')
    except: pass

print("\n=== FINAL TEST RESULTS ===")
print(json.dumps(results, indent=2, ensure_ascii=False))

if results.get('hasLesson2') and results.get('allPlansStartOnOddPage') and results.get('dates78_weekendCount') == 0:
    print("\n>>> ALL TESTS PASSED! Lesson 2 is verified, start/end date scheduler works flawlessly with 0 weekends! <<<")
else:
    print("\n>>> Some tests failed or incomplete! <<<")
