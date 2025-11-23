# Metadata Enrichment Guide

This guide explains how to automatically fetch real show and episode data from TMDB (The Movie Database).

## 🎯 What Will Be Updated

### For Shows:
- ✅ Real descriptions/overviews
- ✅ Accurate release years
- ✅ Content ratings (TV-14, TV-MA, etc.)
- ✅ IMDB ratings
- ✅ Correct genres
- ✅ Cast members
- ✅ Creators
- ✅ High-quality posters
- ✅ High-quality backdrops

### For Episodes:
- ✅ Real episode titles (not just "Episode 1")
- ✅ Episode descriptions/summaries
- ✅ Air dates
- ✅ Runtime/duration
- ✅ Episode thumbnails (still frames)

## 📋 Setup Instructions

### Step 1: Get TMDB API Key (Free!)

1. Go to https://www.themoviedb.org/signup
2. Create a free account
3. Go to https://www.themoviedb.org/settings/api
4. Click "Request an API Key"
5. Choose "Developer" option
6. Fill in the form (use any website URL, it's just for registration)
7. Copy your API Key (v3 auth)

### Step 2: Configure the Script

1. Open `enrich-metadata.js`
2. Find line 9: `const TMDB_API_KEY = 'YOUR_TMDB_API_KEY';`
3. Replace `YOUR_TMDB_API_KEY` with your actual API key
4. Save the file

### Step 3: Run the Script

```bash
node enrich-metadata.js
```

## ⚙️ How It Works

1. **Reads your current data** from `data/streamvault-data.json`
2. **Creates a backup** of your original data
3. **Searches TMDB** for each show by title
4. **Fetches detailed info** for each show
5. **Gets episode data** for each season
6. **Updates metadata** with real information
7. **Saves enriched data** back to the file

## 📊 Example Output

```
🚀 Starting metadata enrichment from TMDB...

📊 Found 76 shows and 311 episodes

📺 Processing shows...

🔍 Searching for: Stranger Things
   ✓ Found: Stranger Things (2016)
   ✓ Updated show metadata

🔍 Searching for: Game of Thrones
   ✓ Found: Game of Thrones (2011)
   ✓ Updated show metadata

🎬 Processing episodes...

📺 Stranger Things
   Season 1:
   ✓ S1E1: Chapter One: The Vanishing of Will Byers
   ✓ S1E2: Chapter Two: The Weirdo on Maple Street
   ✓ S1E3: Chapter Three: Holly, Jolly
   ...

💾 Backup created: streamvault-data.backup.1732345678901.json
✅ Enriched data saved to: streamvault-data.json

📊 Summary:
   Shows processed: 76
   Episodes processed: 311

✨ Metadata enrichment complete!
```

## ⚠️ Important Notes

- **Backup is automatic** - Your original data is saved before any changes
- **Rate limiting** - Script waits 250ms between requests to respect TMDB limits
- **Free tier limits** - TMDB free tier allows 40 requests per 10 seconds (script stays well under this)
- **Matching** - Shows are matched by title, so ensure your show titles are accurate
- **Runtime** - For 76 shows + 311 episodes, expect ~5-10 minutes total

## 🔧 Troubleshooting

### "Not found on TMDB"
- Check if the show title in your database matches the TMDB title
- Try updating the show title to match exactly

### "API key invalid"
- Make sure you copied the entire API key
- Ensure there are no extra spaces
- Verify the key is activated on TMDB

### "Rate limit exceeded"
- The script has built-in delays, but if you hit limits, just wait a few minutes and run again
- The script will skip already-enriched shows

## 🎨 What You'll Get

### Before:
```json
{
  "title": "Episode 1",
  "description": "Episode 1",
  "thumbnailUrl": "https://images.unsplash.com/photo-..."
}
```

### After:
```json
{
  "title": "Chapter One: The Vanishing of Will Byers",
  "description": "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
  "airDate": "2016-07-15",
  "duration": 49,
  "thumbnailUrl": "https://image.tmdb.org/t/p/w500/AdwF..."
}
```

## 🚀 Next Steps After Enrichment

1. **Restart your dev server** to load the new data
2. **Check the website** - all shows should have real descriptions
3. **Verify episodes** - episode titles and descriptions should be accurate
4. **Deploy to production** when satisfied

## 📝 Manual Fixes

If some shows don't match correctly, you can:
1. Check the backup file to see original data
2. Manually edit show titles in the database to match TMDB exactly
3. Re-run the script

---

**Ready to enrich your metadata?** Just get your TMDB API key and run the script! 🎉
