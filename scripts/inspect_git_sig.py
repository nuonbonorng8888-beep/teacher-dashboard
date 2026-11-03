# -*- coding: utf-8 -*-
import subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

res = subprocess.run(['git', 'log', '-S', 'sig_page_index', '-p', '-n', '2'], capture_output=True, text=True, encoding='utf-8')
print(res.stdout[:3000])

