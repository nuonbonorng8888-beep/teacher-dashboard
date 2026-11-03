import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
log_path = r'C:\Users\LENOVO\.gemini\antigravity\brain\f1e067a4-40af-4458-9768-938ce551f866\.system_generated\logs\transcript_full.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    lines = [json.loads(l) for l in f if '"type": "USER_INPUT"' in l or '"type":"USER_INPUT"' in l]

last = lines[-1]
print("=== LAST USER INPUT ===")
print("Keys:", list(last.keys()))
print("Content:", repr(last.get('content')))
print("Media count:", len(last.get('media', [])))
for idx, m in enumerate(last.get('media', [])):
    print(f"  Media {idx}: {m}")
