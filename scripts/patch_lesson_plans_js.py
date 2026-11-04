import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Running Header block
old_header_pat = r'(\s*// --- A\. RUNNING HEADER ---.*?)(p\.drawRectangle\(\{\s*x:\s*60\.0,.*?p\.drawLine\(\{\s*start:\s*\{\s*x:\s*65\.0,\s*y:\s*pageH\s*-\s*47\.0\s*\},.*?color:\s*PDFLib\.rgb\(0,\s*0,\s*0\),\s*\}\);)'

new_header = """        // --- A. RUNNING HEADER ---
        // In Grade 8, only stamp running header on Page 0 (Cover page) because pages 1..N
        // start their table/lesson content immediately at y = 35..45 pt!
        const shouldStampHeader = (pIdx === 0) || (isGrade11 || isGrade12);

        if (shouldStampHeader) {
          // Redact / Whiteout old header zone at top
          const headerWhiteoutY = (isGrade11 || isGrade12) ? (pageH - 82.0) : (pageH - 62.0);
          const headerWhiteoutH = (isGrade11 || isGrade12) ? 62.0 : 56.0;
          p.drawRectangle({
            x: 50.0,
            y: headerWhiteoutY,
            width: 515.0,
            height: headerWhiteoutH,
            color: PDFLib.rgb(1, 1, 1),
          });

          // Yukunthor Logo
          if (logoImg) {
            p.drawImage(logoImg, {
              x: 65.0,
              y: pageH - 43.0,
              width: 27.0,
              height: 27.0,
            });
          }

          // Yukunthor School Title
          if (headerTextImg) {
            p.drawImage(headerTextImg, {
              x: logoImg ? 98.0 : 65.0,
              y: pageH - 40.0,
              width: 250.0,
              height: 20.0,
            });
          }

          // Horizontal Line below Header
          p.drawLine({
            start: { x: 65.0, y: pageH - 47.0 },
            end: { x: 547.0, y: pageH - 47.0 },
            thickness: 0.8,
            color: PDFLib.rgb(0, 0, 0),
          });
        }"""

# 2. Update Signature Canvas block
old_sig_pat = r'const sigCanvas = document\.createElement\(\'canvas\'\);\s*sigCanvas\.width = \d+;.*?const colLeft = \d+;\s*const colMid = \d+;\s*const colRight = \d+;'
new_sig = """const sigCanvas = document.createElement('canvas');
        sigCanvas.width = 1500;
        sigCanvas.height = 360;
        const sctx = sigCanvas.getContext('2d');
        sctx.fillStyle = '#ffffff';
        sctx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);

        // Date text
        const cleanSigDate = plan.sig_date_khmer
          ? plan.sig_date_khmer.replace(/^(\u179a\u17b6\u1787\u1792\u17b6\u1793\u17b8\u1797\u17d2\u1793\u17c6\u1796\u17c1\u1789[\s,]*)?/, '')
          : (plan.date_khmer ? plan.date_khmer : '');
        const sigDateText = cleanSigDate.startsWith('ថ្ងៃទី')
          ? `រាជធានីភ្នំពេញ ${cleanSigDate}`
          : `រាជធានីភ្នំពេញ ថ្ងៃទី ${cleanSigDate}`;

        const colLeft = 250;
        const colMid = 750;
        const colRight = 1250;"""

text = re.sub(old_header_pat, lambda m: new_header, text, flags=re.DOTALL)
text = re.sub(old_sig_pat, lambda m: new_sig, text, flags=re.DOTALL)

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated js/lesson-plans.js successfully!")

# Bump index.html to v=8.4
with open('index.html', 'r', encoding='utf-8') as f:
    idx_text = f.read()

idx_text = idx_text.replace('js/lesson-plans-data.js?v=8.3', 'js/lesson-plans-data.js?v=8.4')
idx_text = idx_text.replace('js/lesson-plans.js?v=8.3', 'js/lesson-plans.js?v=8.4')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_text)

print("Bumped index.html to v=8.4!")
