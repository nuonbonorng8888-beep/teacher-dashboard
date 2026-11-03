# -*- coding: utf-8 -*-
import sys
import os
import fitz

# Check if OCR or text is in test_stamper_result.png or query DOM via simple script
import subprocess
import time
import json
import urllib.request

server = subprocess.Popen(["python", "-m", "http.server", "8089"])
time.sleep(1)

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
edge_proc = subprocess.Popen([
    edge,
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9229",
    "http://localhost:8089/scratch/test_stamper.html"
])
time.sleep(2.5)

try:
    req = urllib.request.urlopen("http://localhost:9229/json")
    tabs = json.loads(req.read().decode('utf-8'))
    print("Found tabs:", len(tabs))
finally:
    edge_proc.terminate()
    server.terminate()
