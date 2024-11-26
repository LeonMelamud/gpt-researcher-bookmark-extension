const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '../out');

// Create icons directory
const iconsDir = path.join(OUT_DIR, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy icon files
const iconSizes = ['16', '48', '128'];
iconSizes.forEach(size => {
    fs.copyFileSync(
        path.join(__dirname, `../public/icons/icon${size}.png`),
        path.join(OUT_DIR, `icons/icon${size}.png`)
    );
});

// Copy background script
fs.copyFileSync(
    path.join(__dirname, '../public/background.js'),
    path.join(OUT_DIR, 'background.js')
);

// Copy manifest
fs.copyFileSync(
    path.join(__dirname, '../manifest.json'),
    path.join(OUT_DIR, 'manifest.json')
);

// Rename _next directory to assets
const nextDir = path.join(OUT_DIR, '_next');
const assetsDir = path.join(OUT_DIR, 'assets');

if (fs.existsSync(nextDir)) {
    // Remove existing assets directory if it exists
    if (fs.existsSync(assetsDir)) {
        fs.rmSync(assetsDir, { recursive: true, force: true });
    }
    // Rename _next to assets
    fs.renameSync(nextDir, assetsDir);

    // Update references in HTML files
    const htmlFiles = ['index.html', '404.html'];
    htmlFiles.forEach(file => {
        const filePath = path.join(OUT_DIR, file);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/\/_next\//g, '/assets/');
            fs.writeFileSync(filePath, content);
        }
    });
}

console.log('Extension files copied successfully!');
