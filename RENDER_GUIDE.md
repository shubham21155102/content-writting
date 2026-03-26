# 🎬 HOW TO RENDER - AI Jobs Horror

## 🚀 Super Simple Render

```bash
# Navigate to project
cd /Users/shubhamkumar/Projects/mas/mas-video

# Start dev server (to preview)
npm run dev
# Open: http://localhost:3000
# Click: "AI-Jobs-Horror-FULL-VIDEO" folder
# Click: "AIJobs-Horror-FULL"

# RENDER THE VIDEO
npx remotion render AIJobs-Horror-FULL out/ai-jobs-horror-final.mp4

# That's it! Ready to upload!
```

---

## 📁 What You Get

```
out/
└── ai-jobs-horror-final.mp4    ← ONE FILE (30 seconds, no audio)
```

---

## 🎵 ADDING MUSIC (Recommended)

### **Easiest Method - Use Platform Music:**

When you upload to **Instagram/TikTok**:
1. Upload the video
2. Use their **built-in music library**
3. Search: "documentary", "news", "serious", "tense"
4. Pick music that fits the vibe
5. Done!

**Benefits:**
- ✅ No copyright issues
- ✅ Perfect length
- ✅ Professional quality
- ✅ Easy to change

---

### **Alternative: Add Your Own Music**

```bash
# Add your own background music
ffmpeg -i out/ai-jobs-horror-final.mp4 \
  -i path/to/your/music.mp3 \
  -c:v copy -c:a aac \
  -map 0:v:0 -map 1:a:0 \
  -shortest \
  out/ai-jobs-horror-with-music.mp4
```

---

## 🎬 Video Structure

| Time | Scene | Content |
|------|-------|---------|
| 0-3s | Scene 1 | "Your job is next." |
| 3-7s | Scene 2 | "85M jobs by 2025" |
| 7-12s | Scene 3 | Timeline of AI replacement |
| 12-17s | Scene 4 | Jobs being replaced NOW |
| 17-22s | Scene 5 | Industries at risk |
| 22-27s | Scene 6 | "Faster than predicted" |
| 27-30s | Scene 7 | "Adapt or be replaced" |

**Total: 30 seconds**

---

## 📱 Upload & Share

Once rendered:

1. **Instagram:** Open app → Upload `ai-jobs-horror-final.mp4` → Add music from library
2. **TikTok:** Open app → Upload `ai-jobs-horror-final.mp4` → Add music from library
3. **YouTube:** Open app → Upload as Short → Add music from library
4. **LinkedIn:** Upload directly (professional audience!)

**Caption:** See `src/reels/ai-jobs-horror/README.md`

---

## ✅ Why No Audio Included?

The auto-generated audio was too disturbing, so it's **not included**.

**Best approach:** Use Instagram/TikTok's music library - they have:
- Tons of free options
- Perfect length matching
- No copyright issues
- Professional quality
- Easy to change

---

## 🎉 Done!

Your video is ready: `out/ai-jobs-horror-final.mp4`

**Just upload and add music from the platform!** 🎬✅
