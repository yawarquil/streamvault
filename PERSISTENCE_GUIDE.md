# 💾 Data Persistence Guide

## ✅ JSON File Storage Implemented!

Your StreamVault now **saves all changes permanently** to a JSON file!

---

## 🎉 What Changed

### Before:
- ❌ Data stored in memory (RAM)
- ❌ All changes lost on server restart
- ❌ Always reset to seed data

### After:
- ✅ Data saved to JSON file
- ✅ Changes persist across restarts
- ✅ Your content is permanent!

---

## 📁 Where Data is Stored

**File Location:**
```
C:\Users\yawar\Desktop\StreamVault\data\streamvault-data.json
```

**What's Saved:**
- All shows (with metadata)
- All episodes (with video URLs)
- Last updated timestamp

**What's NOT Saved:**
- Watchlist (session-based, still in memory)
- Viewing progress (session-based, still in memory)

---

## 🔄 How It Works

### On Server Start:
1. Checks if `data/streamvault-data.json` exists
2. **If exists:** Loads all shows and episodes from file
3. **If not exists:** Creates seed data and saves to file

### On Data Change:
1. You add/edit/delete a show or episode
2. Change applied to memory
3. **Automatically saved to JSON file**
4. Console shows: `💾 Data saved to file`

### On Server Restart:
1. Server starts
2. Loads data from JSON file
3. **All your changes are still there!**

---

## 📊 Example Workflow

```
1. Start server
   → Loads: "📂 Loading data from file..."
   → Shows: "✅ Loaded 10 shows"

2. Add a new show via admin panel
   → Saves: "💾 Data saved to file"

3. Edit an existing show
   → Saves: "💾 Data saved to file"

4. Delete a show
   → Saves: "💾 Data saved to file"

5. Restart server
   → Loads: "📂 Loading data from file..."
   → Shows: "✅ Loaded 11 shows" (your new show is still there!)
```

---

## 🧪 Test Persistence

### Quick Test:
1. **Add a test show:**
   - Go to http://localhost:5000/admin
   - Click "Add Show"
   - Add a show called "Test Persistence"
   - Click "Add Show"

2. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Check if show exists:**
   - Go to http://localhost:5000/admin
   - Look for "Test Persistence"
   - ✅ It should still be there!

---

## 📝 Data File Format

```json
{
  "shows": [
    {
      "id": "uuid-here",
      "title": "Breaking Bad",
      "slug": "breaking-bad",
      "description": "...",
      "posterUrl": "...",
      "backdropUrl": "...",
      "year": 2008,
      "rating": "TV-MA",
      "imdbRating": "9.5",
      "genres": ["Crime", "Drama"],
      "language": "English",
      "totalSeasons": 5,
      "cast": ["Bryan Cranston", "Aaron Paul"],
      "creators": ["Vince Gilligan"],
      "featured": true,
      "trending": true,
      "category": "drama"
    }
  ],
  "episodes": [
    {
      "id": "uuid-here",
      "showId": "show-uuid",
      "season": 1,
      "episodeNumber": 1,
      "title": "Pilot",
      "description": "...",
      "thumbnailUrl": "...",
      "duration": 58,
      "googleDriveUrl": "...",
      "airDate": "2008-01-20"
    }
  ],
  "lastUpdated": "2024-11-19T14:45:00.000Z"
}
```

---

## 🔧 Manual Data Management

### View Data:
```bash
# Open the file
notepad data\streamvault-data.json
```

### Backup Data:
```bash
# Copy the file
copy data\streamvault-data.json data\backup-2024-11-19.json
```

### Reset to Seed Data:
```bash
# Delete the file
del data\streamvault-data.json

# Restart server - will recreate with seed data
npm run dev
```

### Import/Export:
- **Export:** Copy `data/streamvault-data.json` to another location
- **Import:** Replace `data/streamvault-data.json` with your backup
- **Restart server** to load the new data

---

## ⚠️ Important Notes

### Automatic Saves:
- ✅ Every create/update/delete triggers auto-save
- ✅ No manual save needed
- ✅ Console confirms: "💾 Data saved to file"

### File Safety:
- ✅ Creates `data/` folder automatically
- ✅ Pretty-printed JSON (human-readable)
- ✅ Includes timestamp of last update

### Performance:
- ✅ Fast for small-medium datasets (< 1000 shows)
- ⚠️ May slow down with very large datasets
- 💡 For production, consider PostgreSQL

### Backup Strategy:
- 💡 Backup `data/streamvault-data.json` regularly
- 💡 Use version control (Git) for data file
- 💡 Or exclude from Git (already in .gitignore)

---

## 🚀 What You Can Do Now

### ✅ Add Content Permanently:
- Add shows via admin panel
- Add episodes with video URLs
- Edit existing content
- Delete unwanted content
- **All changes are saved forever!**

### ✅ Server Restarts:
- Stop and start server anytime
- Your data persists
- No data loss

### ✅ Share Your Database:
- Copy `data/streamvault-data.json`
- Share with others
- They get your entire library

---

## 🎯 Console Messages

### On Server Start:
```
📂 Loading data from file...
✅ Loaded 10 shows
✅ Loaded 80 episodes
```

### On First Run (No Data File):
```
📦 No data file found, seeding initial data...
💾 Data saved to file
```

### On Data Change:
```
💾 Data saved to file
```

### On Error:
```
❌ Error loading data, using seed data: [error details]
❌ Error saving data: [error details]
```

---

## 🎊 Summary

**Your StreamVault now has:**
- ✅ **Persistent storage** - Changes saved to file
- ✅ **Automatic backups** - Every change auto-saved
- ✅ **Human-readable** - JSON format, easy to edit
- ✅ **Restart-safe** - Data survives server restarts
- ✅ **Portable** - Copy file to backup/share

**No more data loss!** 🎉

---

## 📚 Next Steps

1. **Test it:** Add a show, restart server, verify it's still there
2. **Backup:** Copy `data/streamvault-data.json` somewhere safe
3. **Use it:** Add all your content via admin panel
4. **Enjoy:** Your content is now permanent!

---

**Made with ❤️ for StreamVault**

*Your data is now safe and persistent!*
