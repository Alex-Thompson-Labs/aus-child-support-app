const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './assets/source_images';
const outputDir = './assets/images/webp';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`❌ Error: Could not find directory '${inputDir}'.`);
      return;
    }
    return console.error('Could not list the directory.', err);
  }

  files.forEach((file) => {
    // 1. GET EXTENSION
    const ext = path.extname(file).toLowerCase();

    // 2. CHECK FOR BOTH PNG AND JPEG
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      const inputFile = path.join(inputDir, file);

      // 3. GET FILENAME WITHOUT EXTENSION (Works for any length extension)
      const fileNameNoExt = path.parse(file).name;
      const outputFile = path.join(outputDir, fileNameNoExt + '.webp');

      sharp(inputFile)
        .webp({ quality: 75 })
        .toFile(outputFile)
        .then(() => console.log(`✅ Converted: ${file} -> ${fileNameNoExt}.webp`))
        .catch((err) => console.error(`❌ Error converting ${file}:`, err));
    }
  });
});