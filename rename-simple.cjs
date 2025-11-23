const fs = require('fs');
const path = require('path');

// Directory containing the files to rename
const targetDir = 'C:\\Users\\yawar\\Desktop\\worthcrete_extracted';

// Function to convert title to slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start
    .replace(/-+$/, '');         // Trim - from end
}

// Main function
function renameFiles() {
  try {
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Directory not found: ${targetDir}`);
      return;
    }

    const files = fs.readdirSync(targetDir);
    console.log(`📁 Found ${files.length} files\n`);

    // First, let's see what files we have
    console.log('📋 Current files:');
    files.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('This is a preview. To actually rename files, uncomment the rename code.');
    console.log('='.repeat(60));

    // Example of what the renaming would look like
    files.forEach((filename) => {
      const oldPath = path.join(targetDir, filename);
      
      if (fs.statSync(oldPath).isDirectory()) {
        return;
      }

      const ext = path.extname(filename);
      const nameWithoutExt = filename.replace(ext, '');
      
      // Create slug from filename
      const slug = slugify(nameWithoutExt);
      const newFilename = `${slug}${ext}`;

      console.log(`\n${filename}`);
      console.log(`  -> ${newFilename}`);

      // UNCOMMENT BELOW TO ACTUALLY RENAME FILES
      // const newPath = path.join(targetDir, newFilename);
      // if (!fs.existsSync(newPath)) {
      //   fs.renameSync(oldPath, newPath);
      //   console.log('  ✅ Renamed!');
      // }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

renameFiles();
