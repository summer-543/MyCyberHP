import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

for filename in files:
    with open(filename, 'rb') as f:
        content = f.read()
    
    # Try to decode as UTF-8, if fails try Shift-JIS
    try:
        text = content.decode('utf-8')
    except UnicodeDecodeError:
        text = content.decode('shift-jis')
    
    # Remove the broken link string
    text = text.replace('`n    <link rel="stylesheet" href="css/mobile.css">', '')
    
    # Add the correct link if not present
    if 'css/mobile.css' not in text:
        text = text.replace('css/style.css">', 'css/style.css">\n    <link rel="stylesheet" href="css/mobile.css">')
    
    # Write back as UTF-8
    with open(filename, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)

print("Done fixing HTML files.")
