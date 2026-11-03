import os
import shutil
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Check what pdfs exist in កិច្ចការតែងការទី១២
for f in os.listdir('កិច្ចការតែងការទី១២'):
    print("In កិច្ចការតែងការទី១២:", f)

# Copy to root if needed
mappings = [
    ('កិច្ចការតែងការទី១២/ជំពូកទី_1_ចំនួនកុំផ្លិច (2).pdf', 'ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.pdf'),
    ('កិច្ចការតែងការទី១២/ជំពូកទី 2 លីមីត (2).pdf', 'ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.pdf'),
    ('កិច្ចការតែងការទី១២/ជំពូកទី_1_ចំនួនកុំផ្លិច (2).docx', 'ជំពូកទី_1_ចំនួនកុំផ្លិច_ព្រះយុគន្ធរ_NGS.docx'),
    ('កិច្ចការតែងការទី១២/ជំពូកទី 2 លីមីត (2).docx', 'ជំពូកទី_2_លីមីត_ព្រះយុគន្ធរ_NGS.docx'),
]

for src, dst in mappings:
    if os.path.exists(src) and not os.path.exists(dst):
        shutil.copy2(src, dst)
        print(f"Copied {src} -> {dst}")

