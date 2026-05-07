import os

# Original content parts for index.html (reconstructed from history and my edits)
# I will use a simplified approach: Read the file, replace known corrupted sequences.

replacements = {
    '惁E': '情報',
    'チEイン': 'デザイン',
    'チE': 'ッ',
    'ペEジ': 'ページ',
    'Eタン': 'ボタン',
    '裁E': '装飾',
    '冁E': '内部',
    'スチEEタスバE': 'ステータスバー',
    'オーバEレイ': 'オーバーレイ',
    '、E10-8507': '〒910-8507',
    '閉じめE': '閉じる',
    '繧ｵ繧､繝舌・繧ｹ繧ｿ繧､繝ｫ縺ｮ閭梧勹陬・｣ｾ隕∫ｴ': 'サイバースタイルの背景装飾要素',
    '縺雁・縺ｫ蜈･繧翫そ繧ｯ繧ｷ繝ｧ繝ｳ': 'お気に入りセクション',
    'E': 'の', # Common fallback for corrupted 'no'
    '惁E': '報'
}

files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in files:
    with open(filename, 'rb') as f:
        content = f.read()
    
    # Try to fix by decoding as Latin-1 and then encoding/decoding if it was interpreted as Shift-JIS
    # Actually, simpler: search and replace in the string
    try:
        text = content.decode('utf-8', errors='replace')
    except:
        text = content.decode('latin-1', errors='replace')

    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Final cleanup of any weird residues from the failed powershell command
    text = text.replace('`n    <link rel="stylesheet" href="css/mobile.css">', '')
    
    # Ensure correct link
    if 'css/mobile.css' not in text:
        text = text.replace('css/style.css">', 'css/style.css">\n    <link rel="stylesheet" href="css/mobile.css">')

    with open(filename, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)

print("Restoration attempted.")
