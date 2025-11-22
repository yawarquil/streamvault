# 🎬 Google Drive Video Setup Guide

## ✅ Video Player Fixed!

The watch page now correctly uses the video ID from your episodes.

---

## 🔧 How to Fix "You need access" Error

### Step 1: Open Your Video in Google Drive

1. Go to Google Drive
2. Find your video file
3. Right-click on it

### Step 2: Change Sharing Settings

1. Click **"Share"** or **"Get link"**
2. Click **"Change to anyone with the link"**
3. Make sure it says: **"Anyone with the link can view"**
4. Click **"Copy link"**

### Step 3: Get the File ID

From your link:
```
https://drive.google.com/file/d/1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t/view?usp=drive_link
```

The File ID is: `1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t`

### Step 4: Use in Admin Panel

When adding episodes, use this format:
```
https://drive.google.com/file/d/FILE_ID_HERE/preview
```

**Example:**
```
https://drive.google.com/file/d/1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t/preview
```

---

## 🎯 Quick Fix for Game of Thrones

Your video needs to be shared publicly. Here's how:

### Option 1: Update Sharing (Recommended)

1. **Open Google Drive**
2. **Find your Game of Thrones video**
3. **Right-click → Share**
4. **Click "Change to anyone with the link"**
5. **Set to "Viewer"**
6. **Click "Done"**
7. **Refresh the watch page**

### Option 2: Update the Episode

If sharing doesn't work, you can:

1. Go to http://localhost:5000/admin
2. Find Game of Thrones episodes
3. Delete Episode 1
4. Add it again with a different video

---

## 📝 Correct URL Formats

### ❌ Wrong Formats:
```
https://drive.google.com/file/d/FILE_ID/view
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
```

### ✅ Correct Format:
```
https://drive.google.com/file/d/FILE_ID/preview
```

---

## 🔍 How the Video Player Works

### Code Flow:
1. **Watch page loads** → Gets episode data
2. **Extracts File ID** from `googleDriveUrl`
3. **Creates embed URL**: `https://drive.google.com/file/d/${driveId}/preview`
4. **Displays in iframe**

### What Was Fixed:
- **Before:** Used hardcoded video ID
- **After:** Uses actual video ID from episode data

---

## 🧪 Test Your Video

### Quick Test:
1. Open this URL in your browser:
   ```
   https://drive.google.com/file/d/1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t/preview
   ```

2. **If you see the video:** ✅ Sharing is correct
3. **If you see "You need access":** ❌ Need to change sharing settings

---

## 🎬 Supported Video Formats

Google Drive supports:
- ✅ MP4 (recommended)
- ✅ AVI
- ✅ MOV
- ✅ WMV
- ✅ FLV
- ✅ WebM
- ✅ MKV (may need conversion)

**Recommended:** MP4 with H.264 codec

---

## 💡 Pro Tips

### For Best Performance:
1. **Upload in 1080p or 720p** (not 4K)
2. **Use MP4 format**
3. **Keep file size under 5GB**
4. **Enable "Anyone with link can view"**

### For Multiple Episodes:
1. **Create a folder** for each show
2. **Upload all episodes** to that folder
3. **Share the entire folder** publicly
4. **Get individual file IDs** for each episode

### For Privacy:
- Google Drive links are only accessible to those with the link
- No one can search for your videos
- You can revoke access anytime

---

## 🚨 Common Issues

### Issue 1: "You need access"
**Solution:** Change sharing to "Anyone with the link can view"

### Issue 2: Video not loading
**Solution:** 
- Check file format (use MP4)
- Check file size (under 5GB)
- Check sharing settings

### Issue 3: Video plays but stops
**Solution:** 
- Google Drive has streaming limits
- For production, use a proper video host (Vimeo, YouTube, etc.)

### Issue 4: Wrong video plays
**Solution:**
- Check the File ID is correct
- Make sure URL format is `/preview` not `/view`

---

## 🔄 Update Existing Episodes

If you need to update the video URL for existing episodes:

1. **Go to Admin Panel:**
   ```
   http://localhost:5000/admin
   ```

2. **Click "Shows" tab**

3. **Find the show**

4. **Click "Edit"**

5. **Note:** Currently you can't edit episodes directly
   - You need to delete and re-add the episode
   - OR manually edit `data/streamvault-data.json`

---

## 📊 Current Status

### Your Game of Thrones Episode:
- **File ID:** `1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t`
- **Current URL:** `https://drive.google.com/file/d/1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t/preview`
- **Status:** ⚠️ Needs sharing permission update

### To Fix:
1. Open Google Drive
2. Find the file with ID: `1J7Un5Sz_O2EYD6jT69NOw5g_OGtCnW-t`
3. Share publicly
4. Refresh watch page

---

## ✅ Checklist

Before adding a video:
- [ ] Video uploaded to Google Drive
- [ ] Sharing set to "Anyone with the link can view"
- [ ] File ID extracted from share link
- [ ] URL formatted as `/preview` not `/view`
- [ ] Tested URL in browser

---

## 🎉 Once Fixed

After updating sharing settings:
1. Refresh the watch page
2. Video should load automatically
3. No need to restart server
4. No need to update database

**The fix is live! Just update your Google Drive sharing settings!** 🚀

---

**Made with ❤️ for StreamVault**

*Share your videos, share your stories!* 📺
