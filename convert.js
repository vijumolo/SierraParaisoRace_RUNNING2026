const fs = require('fs');
const data = fs.readFileSync('resultados.json', 'utf8');
fs.writeFileSync('data.js', 'const athletesData = ' + data + ';');
console.log('Successfully created data.js');
