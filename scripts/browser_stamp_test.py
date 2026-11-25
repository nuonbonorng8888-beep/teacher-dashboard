"""
End-to-end check of the REAL js/lesson-plans.js stamper in headless Edge.

Serves the project root, injects a tiny test page that loads pdf-lib + plan data + whiteout fixes +
lesson-plans.js, stamps the requested plans, and posts each PDF back. Then renders PNG previews.

Usage: python scripts/browser_stamp_test.py OUT_DIR plan_id [plan_id ...]
"""
import sys, json, threading, subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
import pymupdf

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
IDS = sys.argv[2:]
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
done = threading.Event()
got = {}

PAGE = """<!doctype html><meta charset="utf-8"><body>
<script src="/js/pdf-lib.min.js"></script>
<script src="/js/lesson-plans-data.js"></script>
<script src="/js/lesson-plans-whiteout.js"></script>
<script src="/js/lesson-plans.js"></script>
<script>
(async () => {
  const ids = %s;
  const m = window.lessonPlansManager;
  for (const id of ids) {
    try {
      const plan = JSON.parse(JSON.stringify(window.NGS_LESSON_PLANS_DATA.find(p => p.id === id)));
      const res = await fetch(encodeURI(plan.pdf_file));
      const doc = await PDFLib.PDFDocument.load(await res.arrayBuffer(), { ignoreEncryption: true });
      await m.applyPdfCustomStamps(doc, plan);
      await fetch('/__upload?id=' + id, { method: 'POST', body: await doc.save() });
    } catch (e) {
      await fetch('/__upload?id=' + id + '&err=1', { method: 'POST', body: String(e && e.stack || e) });
    }
  }
  await fetch('/__done', { method: 'POST', body: 'ok' });
})();
</script>"""


class H(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith("/__test"):
            b = (PAGE % json.dumps(IDS)).encode("utf-8")
            self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(b))); self.end_headers(); self.wfile.write(b)
        else:
            super().do_GET()

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0)); data = self.rfile.read(n)
        if self.path.startswith("/__upload"):
            q = dict(x.split("=") for x in self.path.split("?")[1].split("&"))
            got[q["id"]] = (data, "err" in q)
        elif self.path.startswith("/__done"):
            done.set()
        self.send_response(200); self.end_headers(); self.wfile.write(b"OK")

    def log_message(self, *a):
        pass


srv = ThreadingHTTPServer(("127.0.0.1", 8097), partial(H, directory=str(ROOT)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
proc = subprocess.Popen([EDGE, "--headless=new", "--disable-gpu", f"--user-data-dir={OUT / '_edge'}",
                         "http://127.0.0.1:8097/__test"])
ok = done.wait(timeout=900)
proc.terminate(); srv.shutdown()
print("finished:", ok)
for pid in IDS:
    if pid not in got:
        print(pid, "NO RESULT"); continue
    data, err = got[pid]
    if err:
        print(pid, "ERROR", data.decode("utf-8", "replace")[:400]); continue
    f = OUT / f"{pid}.pdf"; f.write_bytes(data)
    d = pymupdf.open(f)
    for i, pg in enumerate(d):
        pg.get_pixmap(dpi=70).save(OUT / f"{pid}_p{i+1}.png")
    print(pid, "ok pages", len(d))
