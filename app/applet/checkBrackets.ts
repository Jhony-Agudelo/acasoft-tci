import * as fs from 'fs';

const content = fs.readFileSync('/app/applet/app/page.tsx', 'utf8');
const lines = content.split('\n');

let braceCount = 0;
let parenCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '(') parenCount++;
    else if (char === ')') parenCount--;
  }
  
  if (braceCount < 0 || parenCount < 0) {
    console.log(`Mismatch detected at line ${i + 1}: braces=${braceCount}, parens=${parenCount}`);
    break;
  }
}
console.log(`Final stats - braces:${braceCount}, parens:${parenCount}`);
