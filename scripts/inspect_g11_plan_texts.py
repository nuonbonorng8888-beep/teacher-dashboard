# scripts/inspect_g11_plan_texts.py
import pymupdf as fitz
import sys
sys.stdout.reconfigure(encoding='utf-8')

with fitz.open("កិច្ចការតែងការទី១១/ស្វ៊ីតចំនួនពិត.pdf") as d:
    for p in [0, 10, 20]:
        print(f"=== ស្វ៊ីតចំនួនពិត Page {p+1} ===")
        print(d[p].get_text()[:600])

with fitz.open("កិច្ចការតែងការទី១១/ស្វ៊ីតនព្វន្ត.pdf") as d:
    for p in [0, 8, 16]:
        print(f"=== ស្វ៊ីតនព្វន្ត Page {p+1} ===")
        print(d[p].get_text()[:600])

with fitz.open("កិច្ចការតែងការទី១១/ស្វ៊ីតធរណីមាត្រ.pdf") as d:
    for p in [0, 6, 14, 20]:
        print(f"=== ស្វ៊ីតធរណីមាត្រ Page {p+1} ===")
        print(d[p].get_text()[:600])

