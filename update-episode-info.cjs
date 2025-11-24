// Update Episode Titles and Descriptions from TMDB API
// This script ONLY updates episode titles and descriptions, nothing else

const fs = require('fs');
const path = require('path');

// TMDB API Configuration
const TMDB_API_KEY = '920654cb695ee99175e53d6da8dc2edf';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Read current data
const dataPath = path.join(__dirname, 'data', 'streamvault-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper function to search for a show on TMDB
async function searchShow(title) {
  const url = `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
  const response = await fetch(url);
  const result = await response.json();
  return result.results?.[0]; // Return first match
}

// Helper function to get season details with episodes
async function getSeasonDetails(tmdbId, seasonNumber) {
  const url = `${TMDB_BASE_URL}/tv/${tmdbId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);
  return await response.json();
}

// Get TMDB ID for show (don't modify show data)
async function getShowTmdbId(show) {
  try {
    console.log(`\n🔍 Searching for: ${show.title}`);
    
    const searchResult = await searchShow(show.title);
    if (!searchResult) {
      console.log(`   ❌ Not found on TMDB`);
      return null;
    }
    
    console.log(`   ✓ Found: ${searchResult.name} (${searchResult.first_air_date?.substring(0, 4)})`);
    return searchResult.id;
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

// Update ONLY episode title and description
async function updateEpisodeInfo(episode, tmdbId) {
  try {
    // Get season details
    const seasonData = await getSeasonDetails(tmdbId, episode.season);
    
    // Find matching episode
    const tmdbEpisode = seasonData.episodes?.find(e => e.episode_number === episode.episodeNumber);
    
    if (!tmdbEpisode) {
      console.log(`   ⏭️  S${episode.season}E${episode.episodeNumber} - Not found on TMDB`);
      return episode;
    }
    
    // ONLY update title and description, keep everything else the same
    const updatedEpisode = {
      ...episode,
      title: tmdbEpisode.name || episode.title,
      description: tmdbEpisode.overview || episode.description
    };
    
    console.log(`   ✓ S${episode.season}E${episode.episodeNumber}: ${updatedEpisode.title}`);
    
    return updatedEpisode;
    
  } catch (error) {
    console.log(`   ❌ S${episode.season}E${episode.episodeNumber}: ${error.message}`);
    return episode;
  }
}

// Main execution
async function main() {
  console.log('📝 Starting episode title & description update from TMDB...\n');
  console.log(`📊 Found ${data.shows.length} shows and ${data.episodes.length} episodes\n`);
  
  const tmdbIdMap = new Map(); // Map show IDs to TMDB IDs
  const updatedEpisodes = [];
  
  // First, get TMDB IDs for all shows (don't modify show data)
  console.log('📺 Finding shows on TMDB...');
  for (const show of data.shows) {
    const tmdbId = await getShowTmdbId(show);
    if (tmdbId) {
      tmdbIdMap.set(show.id, tmdbId);
    }
    
    // Rate limiting - wait 250ms between requests
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  
  // Process episodes - ONLY update titles and descriptions
  console.log('\n\n📝 Updating episode titles and descriptions...');
  
  // Group episodes by show
  const episodesByShow = new Map();
  for (const episode of data.episodes) {
    if (!episodesByShow.has(episode.showId)) {
      episodesByShow.set(episode.showId, []);
    }
    episodesByShow.get(episode.showId).push(episode);
  }
  
  let episodesUpdated = 0;
  let episodesSkipped = 0;
  
  // Process each show's episodes
  for (const [showId, episodes] of episodesByShow) {
    const show = data.shows.find(s => s.id === showId);
    const tmdbId = tmdbIdMap.get(showId);
    
    if (!show || !tmdbId) {
      console.log(`\n⏭️  Skipping episodes for unknown show: ${showId}`);
      updatedEpisodes.push(...episodes);
      episodesSkipped += episodes.length;
      continue;
    }
    
    console.log(`\n📺 ${show.title}`);
    
    // Group by season to minimize API calls
    const seasonMap = new Map();
    for (const episode of episodes) {
      if (!seasonMap.has(episode.season)) {
        seasonMap.set(episode.season, []);
      }
      seasonMap.get(episode.season).push(episode);
    }
    
    // Process each season
    for (const [seasonNum, seasonEpisodes] of seasonMap) {
      console.log(`   Season ${seasonNum}:`);
      
      for (const episode of seasonEpisodes) {
        const updated = await updateEpisodeInfo(episode, tmdbId);
        updatedEpisodes.push(updated);
        
        if (updated.title !== episode.title || updated.description !== episode.description) {
          episodesUpdated++;
        } else {
          episodesSkipped++;
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  }
  
  // Save data with updated episode info (shows unchanged)
  const updatedData = {
    shows: data.shows, // Keep original show data
    episodes: updatedEpisodes
  };
  
  // Backup original file
  const backupPath = dataPath.replace('.json', `.backup.${Date.now()}.json`);
  fs.copyFileSync(dataPath, backupPath);
  console.log(`\n💾 Backup created: ${path.basename(backupPath)}`);
  
  // Save updated data
  fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2));
  console.log(`✅ Data saved to: ${path.basename(dataPath)}`);
  
  console.log('\n📊 Summary:');
  console.log(`   Shows: ${data.shows.length} (unchanged)`);
  console.log(`   Episodes updated: ${episodesUpdated}`);
  console.log(`   Episodes skipped: ${episodesSkipped}`);
  console.log('\n✨ Episode info update complete!');
}

main().catch(console.error);
