import subprocess
import time
import os

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_img = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866\test_b2_applied.png"

server = subprocess.Popen(["python", "-m", "http.server", "8093"])
time.sleep(1)

try:
    cmd = [
        edge,
        "--headless",
        "--disable-gpu",
        f"--screenshot={out_img}",
        "--window-size=1600,1200",
        "--virtual-time-budget=5000",
        "http://localhost:8093/scratch/test_runner.html"
    ]
    subprocess.run(cmd, capture_output=True, text=True)
finally:
    server.terminate()

print("File exists?", os.path.exists(out_img))
if os.path.exists(out_img):
    print("Size:", os.path.getsize(out_img))

