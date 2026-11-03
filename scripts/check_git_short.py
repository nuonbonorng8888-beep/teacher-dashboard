import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

res = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True, encoding='utf-8')
for line in res.stdout.splitlines()[:30]:
    print(line)
