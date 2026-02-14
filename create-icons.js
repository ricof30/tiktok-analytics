// Simple script to create placeholder icons using Canvas (for demonstration)
const fs = require('fs');

const createPlaceholderIcon = (size, filename) => {
  // Create SVG as placeholder
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial" font-size="${size * 0.4}" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">📊</text>
</svg>`;
  
  fs.writeFileSync(filename, svg);
  console.log(`Created ${filename}`);
};

createPlaceholderIcon(16, 'icon16.svg');
createPlaceholderIcon(48, 'icon48.svg');
createPlaceholderIcon(128, 'icon128.svg');

console.log('\nNote: For the Chrome extension, you should create proper PNG icons.');
console.log('You can use tools like:');
console.log('- Canva (https://www.canva.com)');
console.log('- Figma (https://www.figma.com)');
console.log('- Or convert these SVGs to PNG using: npm install -g sharp-cli');
