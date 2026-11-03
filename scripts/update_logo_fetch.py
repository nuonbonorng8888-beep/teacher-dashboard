# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = """      // Load Yukunthor round Logo for Running Header
      let logoImg = null;
      try {
        const logoRes = await fetch('images/yukunthor-logo.jpg');
        if (logoRes.ok) {
          const logoBytes = await logoRes.arrayBuffer();
          logoImg = await doc.embedJpg(logoBytes);
        }
      } catch (e) {
        console.warn('Could not load yukunthor-logo.jpg:', e);
      }"""

replacement = """      // Load Yukunthor round Logo for Running Header
      let logoImg = null;
      try {
        let logoRes = await fetch('images/yukunthor-logo.jpg').catch(() => null);
        if (!logoRes || !logoRes.ok) {
          logoRes = await fetch('../images/yukunthor-logo.jpg').catch(() => null);
        }
        if (!logoRes || !logoRes.ok) {
          logoRes = await fetch('/images/yukunthor-logo.jpg').catch(() => null);
        }
        if (logoRes && logoRes.ok) {
          const logoBytes = await logoRes.arrayBuffer();
          logoImg = await doc.embedJpg(logoBytes);
        }
      } catch (e) {
        console.warn('Could not load yukunthor-logo.jpg:', e);
      }"""

if target in code:
    code = code.replace(target, replacement, 1)
    with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS: Updated logo fetching logic")
else:
    print("WARNING: target not found")

