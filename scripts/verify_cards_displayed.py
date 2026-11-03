# -*- coding: utf-8 -*-
import subprocess
import time
import json
import urllib.request
import os

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
screenshot_path = os.path.join(artifacts_dir, "verified_cards_visible.png")

server = subprocess.Popen(['python', '-m', 'http.server', '8098'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)

edge = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
cmd = [
    edge,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1280,1600',
    '--screenshot=' + screenshot_path,
    'http://localhost:8098/?tab=lessonplans'
]
subprocess.run(cmd, capture_output=True)
server.terminate()

print("Screenshot created?", os.path.exists(screenshot_path))
if os.path.exists(screenshot_path):
    print("Screenshot size:", os.path.getsize(screenshot_path))
