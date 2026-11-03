import subprocess
import time
import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

server = subprocess.Popen(["python", "-m", "http.server", "8092"])
time.sleep(1)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
edge_proc = subprocess.Popen([
    edge,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "http://localhost:8092/?tab=lessonplans"
])
time.sleep(2)

try:
    # Query CDP endpoints
    req = urllib.request.urlopen("http://localhost:9222/json")
    tabs = json.loads(req.read().decode('utf-8'))
    print("CDP tabs found:", len(tabs))
    ws_url = tabs[0].get('webSocketDebuggerUrl')
    print("WS URL:", ws_url)
finally:
    edge_proc.terminate()
    server.terminate()
