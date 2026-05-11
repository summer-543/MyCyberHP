const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'sf_objects.html');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');

fs.writeFileSync(filePath, content, 'utf8');
