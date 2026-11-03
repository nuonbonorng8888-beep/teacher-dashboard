import subprocess
import time
import os

edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_test = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866\test_b2_typing.png"

# Start server
server = subprocess.Popen(["python", "-m", "http.server", "8091"])
time.sleep(1)

try:
    # Run Edge headless to screenshot
    # We can pass a URL or small snippet
    test_url = "http://localhost:8091/?tab=lessonplans"
    cmd = [
        edge,
        "--headless",
        "--disable-gpu",
        f"--screenshot={out_test}",
        "--window-size=1600,1200",
        "--virtual-time-budget=3000",
        test_url
    ]
    subprocess.run(cmd, capture_output=True, text=True)
finally:
    server.terminate()

print("File exists?", os.path.exists(out_test))
if os.path.exists(out_test):
    print("Size:", os.path.getsize(out_test))
