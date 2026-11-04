# scripts/capture_g11_g12_direct.py
import sys, os, time, threading, subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
done_event = threading.Event()

class CustomHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/done':
            done_event.set()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass

PORT = 8096
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

def capture_grade(grade_name, filename):
    done_event.clear()
    html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
<script>
localStorage.setItem('ngs_lp_active_grade', '{grade_name}');
window.location.href = '/index.html#lessonplans';
</script>
</body>
</html>"""
    
    with open('scratch/temp_loader.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)
    
    out_file = os.path.join(artifacts_dir, filename)
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--window-size=1400,1050",
        f"--screenshot={out_file}",
        f"http://localhost:{PORT}/scratch/temp_loader.html"
    ]
    proc = subprocess.Popen(cmd)
    time.sleep(4)
    proc.terminate()
    print(f"Captured: {filename}")

capture_grade('ថ្នាក់ទី ១១', 'verified_g11_active.png')
capture_grade('ថ្នាក់ទី ១២', 'verified_g12_active.png')

server.shutdown()
if os.path.exists('scratch/temp_loader.html'):
    try: os.remove('scratch/temp_loader.html')
    except: pass

print("Direct captures done!")

