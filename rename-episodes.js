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
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

// Function to extract show name and episode info from filename
function parseFilename(filename) {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Try to match patterns like:
  // "Show Name S01E01"
  // "Show Name - S01E01"
  // "Show Name 1x01"
  // "Show Name Episode 1"
  
  const patterns = [
    /^(.+?)\s*[Ss](\d+)[Ee](\d+)/,           // Show Name S01E01
    /^(.+?)\s*-\s*[Ss](\d+)[Ee](\d+)/,       // Show Name - S01E01
    /^(.+?)\s*(\d+)x(\d+)/,                   // Show Name 1x01
    /^(.+?)\s*[Ee]pisode\s*(\d+)/i,          // Show Name Episode 1
    /^(.+?)\s*[Ee]p\s*(\d+)/i,               // Show Name Ep 1
  ];
  
  for (const pattern of patterns) {
    const match = nameWithoutExt.match(pattern);
    if (match) {
      const showName = match[1].trim();
      const season = match[2] ? match[2].padStart(2, '0') : '01';
      const episode = match[3] ? match[3].padStart(2, '0') : match[2].padStart(2, '0');
      
      return {
        showName,
        showSlug: slugify(showName),
        season,
        episode,
        extension: path.extname(filename)
      };
    }
  }
  
  // If no pattern matches, return original
  return {
    showName: nameWithoutExt,
    showSlug: slugify(nameWithoutExt),
    season: '01',
    episode: '01',
    extension: path.extname(filename)
  };
}

// Main function to rename files
function renameFiles() {
  try {
    // Check if directory exists
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ Directory not found: ${targetDir}`);
      return;
    }

    // Read all files in directory
    const files = fs.readdirSync(targetDir);
    console.log(`📁 Found ${files.length} files in directory\n`);

    let renamed = 0;
    let skipped = 0;

    files.forEach((filename, index) => {
      const oldPath = path.join(targetDir, filename);
      
      // Skip if it's a directory
      if (fs.statSync(oldPath).isDirectory()) {
        console.log(`⏭️  Skipping directory: ${filename}`);
        skipped++;
        return;
      }

      // Parse the filename
      const parsed = parseFilename(filename);
      
      // Create new filename: show-slug-s01e01.ext
      const newFilename = `${parsed.showSlug}-s${parsed.season}e${parsed.episode}${parsed.extension}`;
      const newPath = path.join(targetDir, newFilename);

      // Check if file already has the correct name
      if (filename === newFilename) {
        console.log(`✅ Already correct: ${filename}`);
        skipped++;
        return;
      }

      // Check if target filename already exists
      if (fs.existsSync(newPath)) {
        console.log(`⚠️  Target exists, skipping: ${filename} -> ${newFilename}`);
        skipped++;
        return;
      }

      // Rename the file
      try {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Renamed: ${filename}`);
        console.log(`   -> ${newFilename}\n`);
        renamed++;
      } catch (err) {
        console.error(`❌ Error renaming ${filename}:`, err.message);
        skipped++;
      }
    });

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Renamed: ${renamed} files`);
    console.log(`⏭️  Skipped: ${skipped} files`);
    console.log(`📊 Total: ${files.length} files`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
console.log('🚀 Starting file rename process...\n');
renameFiles();
