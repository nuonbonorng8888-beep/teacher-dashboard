import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Run git status with porcelain
res = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True, encoding='utf-8')
lines = res.stdout.splitlines()
print(f"Total status items: {len(lines)}")
for l in lines[:20]:
    print(l)

