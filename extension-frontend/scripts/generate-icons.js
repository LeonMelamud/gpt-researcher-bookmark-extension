const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 48, 128];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon${size}.png`));
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error);
