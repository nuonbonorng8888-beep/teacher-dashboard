import os
import glob
import sys
sys.stdout.reconfigure(encoding='utf-8')

for root, dirs, files in os.walk('.'):
    for f in files:
        if 'វ៉ិចទ័រ' in f or 'ជំពូកទី_5' in f or 'ជំពូកទី_២' in f or 'ជំពូកទី_1' in f:
            print(os.path.join(root, f))
