import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

res = subprocess.run(['git', 'diff', '--cached', '--name-only'], capture_output=True, text=True, encoding='utf-8')
staged = res.stdout.splitlines()

over_limit = []
import os
for f in staged:
    if os.path.exists(f):
        sz = os.path.getsize(f)
        if sz >= 100 * 1024 * 1024:
            over_limit.append((f, sz))

print(f"Staged files count: {len(staged)}")
print(f"Files >= 100MB: {len(over_limit)}")
for f, sz in over_limit:
    print(f"  {f}: {sz / (1024*1024):.2f} MB")
