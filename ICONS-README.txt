
# Icon Files Note

The extension requires PNG icons in the following sizes:
- icon16.png (16x16 pixels)
- icon48.png (48x48 pixels)  
- icon128.png (128x128 pixels)

Currently, this folder contains SVG placeholders (icon16.svg, icon48.svg, icon128.svg).

To create proper PNG icons, you can:

1. Use online tools:
   - Canva: https://www.canva.com
   - Figma: https://www.figma.com
   - Icon generators: https://icon.kitchen

2. Use command-line tools:
   npm install -g sharp-cli
   sharp -i icon128.svg -o icon128.png
   sharp -i icon48.svg -o icon48.png
   sharp -i icon16.svg -o icon16.png

3. Design in any graphics editor and export as PNG

For now, you can temporarily rename the manifest.json to use .svg instead of .png,
but Chrome Web Store requires PNG for submission.
