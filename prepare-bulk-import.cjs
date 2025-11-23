const fs = require('fs');
const path = require('path');

const sourceDir = 'C:\\Users\\yawar\\Desktop\\worthcrete_extracted';
const outputDir = 'C:\\Users\\yawar\\Desktop\\StreamVault\\bulk-imports';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function processShowFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    // Extract show slug - remove "tv-series-online-hindi-dubbed" suffix
    const showSlug = data.slug
      .replace(/-tv-series-online-hindi-dubbed$/, '')
      .replace(/-online-hindi-dubbed$/, '');
    
    if (!data.seasons) {
      return null;
    }

    // Process all seasons
    const episodes = [];
    Object.keys(data.seasons).forEach(seasonKey => {
      const seasonNumber = parseInt(seasonKey.replace('season_', ''));
      const seasonEpisodes = data.seasons[seasonKey];
      
      seasonEpisodes.forEach(ep => {
        episodes.push({
          title: `Episode ${ep.episode}`,
          episodeNumber: ep.episode,
          seasonNumber: seasonNumber,
          description: `Episode ${ep.episode}`,
          duration: 45,
          videoUrl: ep.embed_url
          // thumbnailUrl will be auto-generated from Google Drive video URL
        });
      });
    });

    if (episodes.length === 0) {
      return null;
    }

    return {
      showSlug,
      showTitle: data.title,
      totalEpisodes: episodes.length,
      episodes
    };

  } catch (error) {
    console.error(`Error processing ${filepath}:`, error.message);
    return null;
  }
}

function main() {
  const files = fs.readdirSync(sourceDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('all_shows') && !f.includes('database'));
  
  console.log(`📁 Found ${jsonFiles.length} show JSON files\n`);

  let processed = 0;
  let failed = 0;

  jsonFiles.forEach(filename => {
    const filepath = path.join(sourceDir, filename);
    const result = processShowFile(filepath);

    if (result && result.episodes.length > 0) {
      // Save formatted import file - filename matches show slug exactly
      const outputFile = path.join(outputDir, `${result.showSlug}.json`);
      const importData = {
        showSlug: result.showSlug,
        episodes: result.episodes
      };

      fs.writeFileSync(outputFile, JSON.stringify(importData, null, 2));
      console.log(`✅ ${result.showTitle}`);
      console.log(`   Slug: ${result.showSlug}`);
      console.log(`   Episodes: ${result.totalEpisodes}`);
      console.log(`   Output: ${path.basename(outputFile)}\n`);
      processed++;
    } else {
      failed++;
    }
  });

  console.log('='.repeat(60));
  console.log(`✅ Processed: ${processed} shows`);
  console.log(`❌ Failed/Skipped: ${failed} shows`);
  console.log(`📂 Output directory: ${outputDir}`);
  console.log('='.repeat(60));
}

main();
