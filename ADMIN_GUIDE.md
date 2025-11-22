# 🎛️ Admin Dashboard Guide

## ✅ Admin Dashboard Created!

Your StreamVault now has a **fully functional admin dashboard** where you can add new shows and episodes directly through the web interface!

---

## 🚀 Access the Admin Dashboard

### URL:
```
http://localhost:5000/admin
```

**Or click:** [Admin Dashboard](http://localhost:5000/admin)

---

## 🎯 Features

### 1. **Manage Shows Tab**
- View all shows in your library
- See show details (poster, title, year, seasons, rating)
- Delete shows with one click
- Edit shows (coming soon)

### 2. **Add Show Tab**
Complete form to add new shows with:
- **Basic Info:** Title, Slug (auto-generated), Description
- **Images:** Poster URL, Backdrop URL
- **Metadata:** Year, Rating (TV-Y, TV-PG, TV-14, TV-MA), IMDb Rating
- **Classification:** Genres, Language, Category
- **Details:** Total Seasons, Cast, Creators
- **Flags:** Featured (show in hero carousel), Trending

### 3. **Add Episode Tab**
Add episodes to existing shows:
- **Show Selection:** Choose from existing shows
- **Episode Info:** Season, Episode Number, Title, Description
- **Media:** Thumbnail URL, Google Drive Video URL
- **Details:** Duration (minutes), Air Date

---

## 📝 How to Add a New Show

### Step 1: Go to "Add Show" Tab

### Step 2: Fill Out the Form

**Required Fields:**
- **Title:** e.g., "Breaking Bad"
- **Description:** Brief synopsis
- **Poster URL:** Portrait image (600x900px recommended)
  ```
  https://images.unsplash.com/photo-XXXXXX?w=600&h=900&fit=crop
  ```
- **Backdrop URL:** Landscape image (1920x800px recommended)
  ```
  https://images.unsplash.com/photo-XXXXXX?w=1920&h=800&fit=crop
  ```
- **Year:** Release year (e.g., 2008)
- **Rating:** TV-MA, TV-14, etc.
- **IMDb Rating:** e.g., "9.5"
- **Genres:** Comma-separated (e.g., "Crime, Drama, Thriller")
- **Language:** e.g., "English"
- **Total Seasons:** Number of seasons
- **Category:** Action, Drama, Comedy, or Horror
- **Cast:** Comma-separated actors
- **Creators:** Comma-separated creators

**Optional:**
- **Slug:** Auto-generated from title if left empty
- **Featured:** Check to show in hero carousel
- **Trending:** Check to show in trending section

### Step 3: Click "Add Show"

The show will be added immediately and appear on your homepage!

---

## 🎬 How to Add Episodes

### Step 1: Go to "Add Episode" Tab

### Step 2: Select Show
Choose the show from the dropdown

### Step 3: Fill Episode Details

**Required Fields:**
- **Season:** Season number (e.g., 1)
- **Episode Number:** Episode number (e.g., 1)
- **Title:** Episode title (e.g., "Pilot")
- **Description:** Episode synopsis
- **Thumbnail URL:** Episode thumbnail (1280x720px)
  ```
  https://images.unsplash.com/photo-XXXXXX?w=1280&h=720&fit=crop
  ```
- **Duration:** Length in minutes (e.g., 45)
- **Air Date:** Release date (YYYY-MM-DD)
- **Google Drive URL:** Video file URL

### Step 4: Google Drive Video URL

**How to get the URL:**
1. Upload video to Google Drive
2. Right-click → Get link → "Anyone with link can view"
3. Copy the File ID from the URL:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/view
   ```
4. Use this format in the form:
   ```
   https://drive.google.com/file/d/FILE_ID_HERE/preview
   ```

**Example:**
```
https://drive.google.com/file/d/1zcFHiGEOwgq2-j6hMqpsE0ov7qcIUqCd/preview
```

### Step 5: Click "Add Episode"

The episode will be added and available to watch immediately!

---

## 🖼️ Image URLs

### Where to Get Images

**Option 1: Unsplash (Free)**
```
https://images.unsplash.com/photo-XXXXXX?w=WIDTH&h=HEIGHT&fit=crop
```

**Option 2: TMDB API**
- Sign up at https://www.themoviedb.org
- Get API key
- Fetch poster/backdrop URLs

**Option 3: Upload Your Own**
- Use image hosting (Imgur, Cloudinary, etc.)
- Get direct image URL

### Recommended Sizes
- **Poster:** 600x900px (portrait)
- **Backdrop:** 1920x800px (landscape)
- **Thumbnail:** 1280x720px (landscape)

---

## 🗑️ How to Delete Content

### Delete a Show:
1. Go to "Manage Shows" tab
2. Find the show
3. Click "Delete" button
4. Confirm deletion

**Note:** Deleting a show also deletes all its episodes!

---

## 💡 Tips & Best Practices

### For Shows:
- Use high-quality images (WebP or JPEG)
- Write compelling descriptions (2-3 sentences)
- Add accurate metadata (year, rating, genres)
- Include main cast members (3-5 actors)
- Check "Featured" for hero carousel (max 5 shows)
- Check "Trending" for trending section

### For Episodes:
- Use descriptive episode titles
- Write unique descriptions for each episode
- Use consistent thumbnail style
- Ensure video URLs are working
- Add episodes in order (Season 1 Ep 1, then Ep 2, etc.)

### For Videos:
- Upload to Google Drive in HD quality (1080p recommended)
- Set sharing to "Anyone with link can view"
- Use `/preview` at the end of the URL (not `/view`)
- Test the video plays before adding

---

## 🔧 API Endpoints Used

The admin dashboard uses these API endpoints:

### Shows:
- `GET /api/shows` - Get all shows
- `POST /api/admin/shows` - Create show
- `DELETE /api/admin/shows/:id` - Delete show

### Episodes:
- `GET /api/episodes/:showId` - Get episodes
- `POST /api/admin/episodes` - Create episode
- `DELETE /api/admin/episodes/:id` - Delete episode

---

## 🔒 Security Note

**Current Status:** No authentication required

**For Production:**
You should add authentication to protect the admin panel:
1. Add login page
2. Implement JWT tokens
3. Protect `/admin` route
4. Add role-based access control

See `IMPROVEMENTS_PLAN.md` for authentication implementation guide.

---

## 🐛 Troubleshooting

### Show Not Appearing?
- Check if form was submitted successfully
- Refresh the homepage
- Check browser console for errors

### Video Not Playing?
- Verify Google Drive sharing is set to "Anyone with link"
- Check File ID is correct
- Ensure URL ends with `/preview` not `/view`
- Test the Drive link directly in browser

### Images Not Loading?
- Verify image URLs are accessible
- Check URLs are direct image links
- Try opening URL in new tab to test

### Form Validation Errors?
- All required fields must be filled
- IMDb Rating should be a number (e.g., "8.5")
- Year should be 4 digits
- Genres should be comma-separated

---

## 📊 Example Data

### Example Show:
```json
{
  "title": "Breaking Bad",
  "description": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
  "posterUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop",
  "backdropUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=800&fit=crop",
  "year": 2008,
  "rating": "TV-MA",
  "imdbRating": "9.5",
  "genres": "Crime, Drama, Thriller",
  "language": "English",
  "totalSeasons": 5,
  "cast": "Bryan Cranston, Aaron Paul, Anna Gunn",
  "creators": "Vince Gilligan",
  "category": "drama",
  "featured": true,
  "trending": true
}
```

### Example Episode:
```json
{
  "season": 1,
  "episodeNumber": 1,
  "title": "Pilot",
  "description": "A high school chemistry teacher learns he's dying of cancer and teams with a former student to secure his family's future.",
  "thumbnailUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop",
  "duration": 58,
  "googleDriveUrl": "https://drive.google.com/file/d/1zcFHiGEOwgq2-j6hMqpsE0ov7qcIUqCd/preview",
  "airDate": "2008-01-20"
}
```

---

## ✅ Quick Checklist

Before adding content:
- [ ] Have poster image URL ready
- [ ] Have backdrop image URL ready
- [ ] Have episode thumbnail URLs ready
- [ ] Have Google Drive video URLs ready
- [ ] Verified all videos play correctly
- [ ] Wrote compelling descriptions
- [ ] Added accurate metadata

---

## 🎉 You're Ready!

Your admin dashboard is fully functional and ready to use!

**Access it at:** http://localhost:5000/admin

**Start adding content and watch your StreamVault library grow!** 🚀

---

**Made with ❤️ for StreamVault**

*Manage your content with ease!*
