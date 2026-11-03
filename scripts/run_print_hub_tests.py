import subprocess
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
out_img1 = os.path.join(artifacts_dir, "test_print_hub_modal.png")

server = subprocess.Popen(["python", "-m", "http.server", "8094"])
time.sleep(1)

try:
    cmd = [
        edge,
        "--headless",
        "--disable-gpu",
        f"--screenshot={out_img1}",
        "--window-size=1600,1200",
        "--virtual-time-budget=4000",
        "http://localhost:8094/scratch/test_print_hub_runner.html"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    print("Edge return code:", res.returncode)
finally:
    server.terminate()

print("out_img1 exists?", os.path.exists(out_img1))
if os.path.exists(out_img1):
    print("Size:", os.path.getsize(out_img1))

