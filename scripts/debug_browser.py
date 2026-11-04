# scripts/debug_browser.py
import subprocess, time, sys, os, json
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading, urllib.request

sys.stdout.reconfigure(encoding='utf-8')

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

PORT = 8099
server = HTTPServer(('localhost', PORT), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()

edge_paths = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
]
edge_exe = next((p for p in edge_paths if os.path.exists(p)), None)

cmd = [
    edge_exe,
    "--remote-debugging-port=9222",
    "--headless=new",
    "--disable-gpu",
    "--user-data-dir=C:/tmp/edge_profile",
    f"http://localhost:{PORT}/index.html#lessonplans"
]

proc = subprocess.Popen(cmd)
time.sleep(3)

# Query CDP tabs
try:
    tabs = json.loads(urllib.request.urlopen("http://localhost:9222/json").read())
    print("CDP Tabs found:", len(tabs))
    for t in tabs:
        print("Tab:", t.get('title'), t.get('url'))
except Exception as e:
    print("CDP error:", e)

proc.terminate()

