import subprocess
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
out_img = os.path.join(artifacts_dir, "test_stamper_result.png")
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

server = subprocess.Popen(["python", "-m", "http.server", "8099"])
time.sleep(1)

try:
    cmd = [
        edge,
        "--headless",
        "--disable-gpu",
        f"--screenshot={out_img}",
        "--virtual-time-budget=5000",
        "http://localhost:8099/scratch/test_stamper.html"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Edge finished:", res.returncode)
finally:
    server.terminate()

print("Screenshot exists:", os.path.exists(out_img))
