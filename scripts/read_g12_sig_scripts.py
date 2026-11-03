# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

for script in ['scratch/test_perfect_sig.py', 'scratch/apply_master_perfect_pdfs.py', 'update_pdfs_with_schedule.py']:
    print(f"==================== {script} ====================")
    try:
        with open(script, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for l in lines[:100]:
                print(l.rstrip())
    except Exception as e:
        print(e)
