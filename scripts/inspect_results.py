import subprocess
import time
import json
import urllib.request
import sys

sys.stdout.reconfigure(encoding='utf-8')

# We can query DOM via small script
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
server = subprocess.Popen(["python", "-m", "http.server", "8096"])
time.sleep(1)

edge_proc = subprocess.Popen([
    edge,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9226",
    "http://localhost:8096/scratch/test_print_hub_runner.html"
])
time.sleep(2.5)

try:
    req = urllib.request.urlopen("http://localhost:9226/json")
    tabs = json.loads(req.read().decode('utf-8'))
    print("Tabs:", len(tabs))
    for t in tabs:
        print("Tab url:", t.get('url'))
finally:
    edge_proc.terminate()
    server.terminate()

