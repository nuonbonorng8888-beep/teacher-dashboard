import subprocess
import os

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_slides = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866\test_final_slides_g8.png"
url_slides = "http://localhost:8089/?tab=slides&slideGrade=8"

cmd = [
    edge,
    "--headless",
    "--disable-gpu",
    f"--screenshot={out_slides}",
    "--window-size=1600,1200",
    "--virtual-time-budget=3000",
    url_slides
]
print("Running command...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("File exists?", os.path.exists(out_slides))
if os.path.exists(out_slides):
    print("File size:", os.path.getsize(out_slides))
