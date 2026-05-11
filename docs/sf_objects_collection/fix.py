import os

path = r'c:\Users\121pi\Documents\myHP\MyCyberHP\docs\sf_objects_collection\sf_objects.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('\\`', '`').replace('\\$', '$')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
