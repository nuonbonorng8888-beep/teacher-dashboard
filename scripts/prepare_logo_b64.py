import base64

with open('images/yukunthor-logo.jpg', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

with open('scratch/logo_b64.js', 'w', encoding='utf-8') as f:
    f.write(f'const YUKUNTHOR_LOGO_B64 = "{b64}";\n')

print(f'Successfully prepared scratch/logo_b64.js with length: {len(b64)}')

