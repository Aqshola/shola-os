const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/assets/wallpaper');

// Extensions to convert
const extensions = ['.png', '.jpg', '.jpeg'];

function getFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return extensions.includes(ext);
  });
}

async function convertToWebP(inputPath, outputPath) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath.replace(ext, '.webp'));
    
    console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath.replace(ext, '.webp'))}`);
    return true;
  } catch (err) {
    console.error(`✗ Error converting ${inputPath}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🖼️  Converting images to WebP...\n');
  
  const files = getFiles(iconsDir);
  
  if (files.length === 0) {
    console.log('No PNG/JPG images to convert.');
    return;
  }
  
  console.log(`Found ${files.length} image(s) to convert.\n`);
  
  let converted = 0;
  
  for (const file of files) {
    const inputPath = path.join(iconsDir, file);
    const ext = path.extname(file).toLowerCase();
    const outputPath = inputPath.replace(ext, '.webp');
    
    // Skip if already converted
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipped (already exists): ${file}`);
      continue;
    }
    
    const success = await convertToWebP(inputPath, outputPath);
    if (success) converted++;
  }
  
  console.log(`\n✅ Done! Converted ${converted} image(s) to WebP.`);
  console.log('\n📝 Note: ICO files need manual conversion.');
  console.log('Delete old files after verifying webp works: rm public/assets/icons/*.png');
}

main();
