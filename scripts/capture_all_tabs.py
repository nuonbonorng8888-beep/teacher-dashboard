import subprocess
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

artifacts_dir = r"C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866"
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# 1. Create runner for Tab 2 (Multiple)
html_tab2 = """<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>Test Tab 2 Multiple</title>
  <style>body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; } iframe { width:1600px; height:1200px; border:none; }</style>
</head>
<body>
  <iframe id="appFrame" src="/?tab=lessonplans"></iframe>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const frameWin = document.getElementById('appFrame').contentWindow;
        frameWin.lessonPlansManager.openPrintHub('multiple');
      }, 1500);
    });
  </script>
</body>
</html>"""

# 2. Create runner for Tab 3 (Grade)
html_tab3 = """<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>Test Tab 3 Grade</title>
  <style>body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; } iframe { width:1600px; height:1200px; border:none; }</style>
</head>
<body>
  <iframe id="appFrame" src="/?tab=lessonplans"></iframe>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const frameWin = document.getElementById('appFrame').contentWindow;
        frameWin.lessonPlansManager.openPrintHub('grade');
      }, 1500);
    });
  </script>
</body>
</html>"""

# 3. Create runner for Contextual bar (Lesson 1 filtered)
html_l1 = """<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>Test Lesson 1 Contextual Bar</title>
  <style>body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; } iframe { width:1600px; height:1200px; border:none; }</style>
</head>
<body>
  <iframe id="appFrame" src="/?tab=lessonplans"></iframe>
  <script>
    window.addEventListener('load', () => {
      setTimeout(() => {
        const frameWin = document.getElementById('appFrame').contentWindow;
        frameWin.lessonPlansManager.setChapterFilter('g8_l1');
      }, 1500);
    });
  </script>
</body>
</html>"""

with open('scratch/test_tab2.html', 'w', encoding='utf-8') as f: f.write(html_tab2)
with open('scratch/test_tab3.html', 'w', encoding='utf-8') as f: f.write(html_tab3)
with open('scratch/test_l1.html', 'w', encoding='utf-8') as f: f.write(html_l1)

server = subprocess.Popen(["python", "-m", "http.server", "8097"])
time.sleep(1)

try:
    for name, page in [
        ("test_print_hub_tab2.png", "scratch/test_tab2.html"),
        ("test_print_hub_tab3.png", "scratch/test_tab3.html"),
        ("test_contextual_l1.png", "scratch/test_l1.html")
    ]:
        out_p = os.path.join(artifacts_dir, name)
        cmd = [
            edge,
            "--headless",
            "--disable-gpu",
            f"--screenshot={out_p}",
            "--window-size=1600,1200",
            "--virtual-time-budget=4000",
            f"http://localhost:8097/{page}"
        ]
        subprocess.run(cmd, capture_output=True)
        print(f"Captured {name}: exists={os.path.exists(out_p)}, size={os.path.getsize(out_p) if os.path.exists(out_p) else 0}")
finally:
    server.terminate()

