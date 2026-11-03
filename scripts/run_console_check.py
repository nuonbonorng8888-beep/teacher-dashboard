# -*- coding: utf-8 -*-
import subprocess, time, json, urllib.request, sys
sys.stdout.reconfigure(encoding='utf-8')

# We can capture browser console by using msedge with --enable-logging --v=1
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
server = subprocess.Popen(["python", "-m", "http.server", "8095"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)

# Write a runner that catches every single error in applyPdfCustomStamps
runner_html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<div id="log"></div>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js?v=7.7"></script>
<script src="/js/lesson-plans.js?v=7.7"></script>
<script>
function log(msg) {
  document.getElementById('log').innerHTML += msg + '<br>';
  console.log(msg);
}
window.onerror = function(m, u, l) { log('WINDOW ERROR: ' + m + ' at ' + l); };
async function test() {
  try {
    const mgr = window.lessonPlansManager;
    const p = mgr.plans.find(x => x.id === 'plan_g8_1');
    p.class_name = '8NGS_B2';
    p.date_khmer = 'ថ្ងៃព្រហស្បតិ៍ ទី៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦';
    p.teacher = 'ថោង សុភារី';

    const res = await fetch(p.pdf_file);
    const bytes = await res.arrayBuffer();
    const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });

    log('Loaded doc, pages: ' + doc.getPageCount());
    await mgr.applyPdfCustomStamps(doc, p);
    log('applyPdfCustomStamps finished!');
    
    // Check pages images
    const pages = doc.getPages();
    for (let i = 0; i < pages.length; i++) {
      log('Page ' + i + ' height: ' + pages[i].getHeight());
    }
  } catch(e) {
    log('CATCH ERROR: ' + e.message + ' stack: ' + e.stack);
  }
}
window.addEventListener('load', test);
</script>
</body>
</html>"""

with open('scratch/test_console.html', 'w', encoding='utf-8') as f:
    f.write(runner_html)

proc = subprocess.Popen([
    edge,
    "--headless=new",
    "--disable-gpu",
    "--dump-dom",
    "http://localhost:8095/scratch/test_console.html"
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

stdout, stderr = proc.communicate(timeout=10)
server.terminate()
print("DOM output:")
print(stdout.decode('utf-8', errors='ignore'))
