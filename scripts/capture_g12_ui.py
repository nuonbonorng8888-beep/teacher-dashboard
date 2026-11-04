# scripts/capture_g12_ui.py
import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"

class CustomHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

PORT = 8090
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

html = """<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
localStorage.setItem('ngs_lp_active_grade', 'ថ្នាក់ទី ១២');
window.location.href = '/index.html#lessonplans';
</script>
</body>
</html>"""

os.makedirs('scratch', exist_ok=True)
with open('scratch/temp_loader_g12.html', 'w', encoding='utf-8') as f:
    f.write(html)

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

out_file = os.path.join(artifacts_dir, "verified_grade12_ui.png")
cmd = [
    edge_exe,
    "--headless=new",
    "--disable-gpu",
    "--window-size=1400,1050",
    f"--screenshot={out_file}",
    f"http://localhost:{PORT}/scratch/temp_loader_g12.html"
]

proc = subprocess.Popen(cmd)
time.sleep(5)
proc.terminate()
server.shutdown()

print("Grade 12 captured:", os.path.exists(out_file))
