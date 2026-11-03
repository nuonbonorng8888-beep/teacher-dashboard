# -*- coding: utf-8 -*-
import sys
import os

with open('scratch/logo_b64.js', 'r', encoding='utf-8') as f:
    logo_js = f.read().strip()

with open('js/lesson-plans.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert logo_js and b64ToUint8 at top
target1 = "'use strict';"
replacement1 = f"""'use strict';

  // Base64-embedded Yukunthor School Logo (Offline, 100% reliable)
  {logo_js}

  // Helper to convert Base64 string to Uint8Array synchronously (no fetch needed)
  function b64ToUint8(b64) {{
    const cleanB64 = b64.includes(',') ? b64.split(',')[1] : b64;
    const bin = atob(cleanB64);
    const len = bin.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }}"""

if target1 in content and "YUKUNTHOR_LOGO_B64" not in content:
    content = content.replace(target1, replacement1, 1)
    print("Added YUKUNTHOR_LOGO_B64 and b64ToUint8")
else:
    print("Logo already present or target not found")

# 2. Update makeTextImg to use b64ToUint8
target2 = """        const pngUrl = canvas.toDataURL('image/png');
        const bytes = await fetch(pngUrl).then(r => r.arrayBuffer());
        return await doc.embedPng(bytes);"""
replacement2 = """        return await doc.embedPng(b64ToUint8(canvas.toDataURL('image/png')));"""
if target2 in content:
    content = content.replace(target2, replacement2, 1)
    print("Updated makeTextImg to use b64ToUint8")

# 3. Update logo loading and headerTextImg in applyPdfCustomStamps
old_logo_block = """      // Load Yukunthor round Logo for Running Header
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
      }

      // Pre-render Running Header Text (Khmer OS Muol Light)
      let headerTextImg = null;
      try {
        const hCanvas = document.createElement('canvas');
        hCanvas.width = 1200;
        hCanvas.height = 90;
        const hctx = hCanvas.getContext('2d');
        hctx.fillStyle = '#ffffff';
        hctx.fillRect(0, 0, hCanvas.width, hCanvas.height);
        hctx.fillStyle = '#000000';
        hctx.font = 'bold 34px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        hctx.fillText('វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)', 5, 60);
        const hPngUrl = hCanvas.toDataURL('image/png');
        const hBytes = await fetch(hPngUrl).then(r => r.arrayBuffer());
        headerTextImg = await doc.embedPng(hBytes);
      } catch (e) {}"""

new_logo_block = """      // 1. Embed Logo directly from Base64 (Zero network request, works offline & on file://)
      let logoImg = null;
      try {
        if (typeof YUKUNTHOR_LOGO_B64 !== 'undefined' && YUKUNTHOR_LOGO_B64) {
          logoImg = await doc.embedJpg(b64ToUint8(YUKUNTHOR_LOGO_B64));
        }
      } catch (err) {
        console.warn('Error embedding base64 logo:', err);
      }

      // Pre-render Running Header Text (Khmer OS Muol Light)
      let headerTextImg = null;
      try {
        const hCanvas = document.createElement('canvas');
        hCanvas.width = 1200;
        hCanvas.height = 90;
        const hctx = hCanvas.getContext('2d');
        hctx.fillStyle = '#ffffff';
        hctx.fillRect(0, 0, hCanvas.width, hCanvas.height);
        hctx.fillStyle = '#000000';
        hctx.font = 'bold 34px "Khmer OS Muol Light", "Khmer OS Muol", "Khmer OS Siemreap", sans-serif';
        hctx.fillText('វិទ្យាល័យព្រះយុគន្ធរ សាលារៀនជំនាន់ថ្មី (NGS)', 5, 60);
        headerTextImg = await doc.embedPng(b64ToUint8(hCanvas.toDataURL('image/png')));
      } catch (e) {
        console.warn('Error pre-rendering header text:', e);
      }"""

if old_logo_block in content:
    content = content.replace(old_logo_block, new_logo_block, 1)
    print("Updated logo loading and headerTextImg")

# 4. Update footer canvas to use b64ToUint8
old_footer_block = """          const fPngUrl = fCanvas.toDataURL('image/png');
          const fBytes = await fetch(fPngUrl).then(r => r.arrayBuffer());
          const footerImg = await doc.embedPng(fBytes);"""
new_footer_block = """          const footerImg = await doc.embedPng(b64ToUint8(fCanvas.toDataURL('image/png')));"""
if old_footer_block in content:
    content = content.replace(old_footer_block, new_footer_block, 1)
    print("Updated footer stamping to use b64ToUint8")

# 5. Update sigCanvas to use b64ToUint8
old_sig_block = """        const sigPngUrl = sigCanvas.toDataURL('image/png');
        const sigPngBytes = await fetch(sigPngUrl).then(r => r.arrayBuffer());
        const sigBlockImg = await doc.embedPng(sigPngBytes);"""
new_sig_block = """        const sigBlockImg = await doc.embedPng(b64ToUint8(sigCanvas.toDataURL('image/png')));"""
if old_sig_block in content:
    content = content.replace(old_sig_block, new_sig_block, 1)
    print("Updated signature stamping to use b64ToUint8")

with open('js/lesson-plans.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved js/lesson-plans.js successfully!")

