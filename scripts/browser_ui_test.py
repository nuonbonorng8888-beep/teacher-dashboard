"""
Render the Lesson Plans tab for a grade in headless Edge using the REAL js files and report
JS errors, plan/chapter counts and what the toolbar shows.

Usage: python scripts/browser_ui_test.py "ថ្នាក់ទី ៩"
"""
import sys, json, threading, subprocess, tempfile
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parent.parent
GRADE = sys.argv[1] if len(sys.argv) > 1 else "ថ្នាក់ទី ៩"
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
done = threading.Event()
result = {}

PAGE = """<!doctype html><meta charset="utf-8"><body>
<div id="tab-lessonplans"></div>
<div id="printLessonPlansModal"></div><div id="pdfInspectionModal" class="hidden"></div>
<script>
window.__errors = [];
window.onerror = (m, s, l) => window.__errors.push(m + ' @' + (s||'').split('/').pop() + ':' + l);
localStorage.setItem('ngs_lp_active_grade', %s);
</script>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js"></script>
<script src="/js/lesson-plans-whiteout.js"></script>
<script src="/js/lesson-plans.js"></script>
<script>
(async () => {
  let out = {};
  try {
    const m = window.lessonPlansManager;
    m.init();
    const html = document.getElementById('tab-lessonplans').innerHTML;
    out.grade = m.selectedGrade;
    out.class = m.savedClass;
    out.plans = m.plans.filter(p => p.grade === m.selectedGrade).length;
    out.cards = (document.querySelectorAll('#lessonPlansListContainer > *').length);
    out.chapters = m.getGradeChapters ? m.getGradeChapters().length : null;
    out.hasG9Tab = html.includes('ថ្នាក់ទី ៩');
    out.classPills = [...document.querySelectorAll('button[onclick*="setClassPreset"]')].map(b => b.textContent.trim());
    out.firstCard = (document.querySelector('#lessonPlansListContainer h3') || {}).textContent;
    out.label = (html.match(/(ម៉ោងទី [^ ]+)/) || [])[1];
    m.setChapterFilter && m.setChapterFilter('g9_l14');
    out.cardsLesson14 = document.querySelectorAll('#lessonPlansListContainer h3').length;
  } catch (e) { out.exception = String(e && e.stack || e); }
  out.errors = window.__errors;
  await fetch('/__result', { method: 'POST', body: JSON.stringify(out) });
})();
</script>"""


class H(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/__test"):
            b = (PAGE % json.dumps(GRADE)).encode("utf-8")
            self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)
        else:
            super().do_GET()

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0)); data = self.rfile.read(n)
        if self.path.startswith("/__result"):
            result.update(json.loads(data.decode("utf-8"))); done.set()
        self.send_response(200); self.end_headers(); self.wfile.write(b"OK")

    def log_message(self, *a):
        pass


srv = ThreadingHTTPServer(("127.0.0.1", 8098), partial(H, directory=str(ROOT)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
tmp = tempfile.mkdtemp()
proc = subprocess.Popen([EDGE, "--headless=new", "--disable-gpu", f"--user-data-dir={tmp}",
                         "http://127.0.0.1:8098/__test"])
ok = done.wait(timeout=60)
proc.terminate(); srv.shutdown()
print("finished:", ok)
print(json.dumps(result, ensure_ascii=False, indent=1))
