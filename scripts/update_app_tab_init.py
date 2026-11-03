import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  // Initial tab render (supports URL query ?tab=...)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') || 'dashboard';
  switchTab(initialTab);
});"""

replacement = """  // Expose switchTab globally
  window.switchTab = switchTab;

  // Initial tab render (supports URL query ?tab=... or #hash)
  const urlParams = new URLSearchParams(window.location.search);
  const hashTab = window.location.hash.replace('#', '');
  const initialTab = urlParams.get('tab') || (hashTab && document.getElementById('tab-' + hashTab) ? hashTab : null) || 'dashboard';
  switchTab(initialTab);
});"""

if target not in text:
    target = target.replace('\n', '\r\n')
    replacement = replacement.replace('\n', '\r\n')

if target in text:
    text = text.replace(target, replacement)
    with open('js/app.js', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated js/app.js successfully")
else:
    print("Could not find target in js/app.js")
