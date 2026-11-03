import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/teaching-slides-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    '"chapter_title": "ថ្នាក់ទី ៨ ៖ ជំពូកទី ៤ ៖ ធរណីមាត្រក្នុងប្លង់"',
    '"chapter_title": "ថ្នាក់ទី ៨ ៖ មេរៀនទី ១២ ៖ ការប្រៀបធៀបត្រីកោណ"'
)
text = text.replace(
    '"id": "g8_template",\n    "chapter_num": 4,',
    '"id": "g8_template",\n    "chapter_num": 12,'
).replace(
    '"id": "g8_template",\r\n    "chapter_num": 4,',
    '"id": "g8_template",\r\n    "chapter_num": 12,'
)

with open('js/teaching-slides-data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated js/teaching-slides-data.js successfully.")

