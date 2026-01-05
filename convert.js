const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// CHANGED: Look in a dedicated source folder
const inputDir = './assets/source_images';
const outputDir = './assets/images/webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    // Friendly error if you forgot to make the folder
    if (err.code === 'ENOENT') {
      console.error(
        `❌ Error: Could not find directory '${inputDir}'. Did you create it?`
      );
      return;
    }
    return console.error('Could not list the directory.', err);
  }

  files.forEach((file) => {
    if (path.extname(file).toLowerCase() === '.png') {
      const inputFile = path.join(inputDir, file);
      const outputFile = path.join(
        outputDir,
        path.basename(file, '.png') + '.webp'
      );

      sharp(inputFile)
        .webp({ quality: 75 })
        .toFile(outputFile)
        .then(() => console.log(`✅ Converted: ${file}`))
        .catch((err) => console.error(`❌ Error converting ${file}:`, err));
    }
  });
});
