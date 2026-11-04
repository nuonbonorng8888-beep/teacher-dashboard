# scripts/capture_real_ui.py
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

PORT = 8093
server = HTTPServer(('localhost', PORT), CustomHandler)
threading.Thread(target=server.serve_forever, daemon=True).start()

def capture_view(grade_cmd, filename):
    done_event.clear()
    
    # We create a wrapper that opens the real index.html inside an iframe or directly controls it
    html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; overflow:hidden;">
<iframe id="appFrame" src="/index.html#lessonplans" style="width:100vw; height:100vh; border:none;"></iframe>
<script>
const frame = document.getElementById('appFrame');
frame.onload = () => {{
  setTimeout(() => {{
    const win = frame.contentWindow;
    if (win && win.lessonPlansManager) {{
      {grade_cmd}
      setTimeout(() => {{
        fetch('/done', {{ method: 'POST', body: 'done' }});
      }}, 1200);
    }}
  }}, 1000);
}};
</script>
</body>
</html>"""
    
    with open('scratch/temp_capture_frame.html', 'w', encoding='utf-8') as f:
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
        "--window-size=1400,950",
        f"--screenshot={out_file}",
        f"http://localhost:{PORT}/scratch/temp_capture_frame.html"
    ]
    proc = subprocess.Popen(cmd)
    done_event.wait(timeout=10)
    time.sleep(2)
    proc.terminate()
    print(f"Captured: {filename}")

capture_view("win.lessonPlansManager.setGrade('ថ្នាក់ទី ១១');", "ui_grade11_verified.png")
capture_view("win.lessonPlansManager.setGrade('ថ្នាក់ទី ១២');", "ui_grade12_verified.png")

server.shutdown()
if os.path.exists('scratch/temp_capture_frame.html'):
    try: os.remove('scratch/temp_capture_frame.html')
    except: pass

print("All real UI screenshots captured successfully!")
