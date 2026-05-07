import os

# 修正用マッピング
replacements = {
    '惁E': '情報',
    '裁E': '装飾',
    'ペEジ': 'ページ',
    'Eタン': 'ボタン',
    'チE': 'ッ',
    'ぁE': 'い',
    'めE': 'や',
    '店E': '店の',
    'E': 'の',
    'クリチE': 'クリック',
    'コンチE': 'コンテンツ',
    'ドリチE': 'ドリップ',
    'E刁E': '自分',
    '褁E': '数',
    'ハE': 'ハマ',
    'チEロチE': 'コントローラー',
    '旁E': '旅行',
    '、E': '。',
    '': '',
    '`n    <link rel="stylesheet" href="css/mobile.css">': '', # 二重リンク防止
}

files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in files:
    try:
        # まずはUTF-8で読み込みを試みる
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        # 失敗した場合はlatin-1などで読み込みを試みる（バイナリ的に保持）
        with open(filename, 'r', encoding='latin-1') as f:
            content = f.read()

    # 置換
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # mobile.cssのリンクが消えてしまった場合の保険
    if 'css/mobile.css' not in content:
        content = content.replace('css/style.css">', 'css/style.css">\n    <link rel="stylesheet" href="css/mobile.css">')

    # 書き出し
    with open(filename, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content)

print("Batch fix completed.")
