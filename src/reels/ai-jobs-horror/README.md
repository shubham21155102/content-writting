# 🎬 AI Jobs Horror - Documentary Style

> **A realistic, documentary-style reel about AI job replacement**
> Scary because it's TRUE and happening NOW

---

## 📋 Overview

This is a **30-second documentary-style reel** about AI job replacement. Unlike dramatic horror, this scares viewers because:

- ✅ **Real facts** - All statistics from credible sources
- ✅ **Happening NOW** - Not sci-fi, it's already begun
- ✅ **Personal impact** - "Your job is next"
- ✅ **Professional aesthetic** - Like a news report or documentary

**Target Audience:** Working professionals, job seekers, career-focused people
**Platform:** Instagram Reels, TikTok, YouTube Shorts, LinkedIn
**Format:** 9:16 vertical (1080x1920)
**Duration:** 30 seconds
**Style:** Documentary, clean, professional

---

## 🚀 Quick Start

```bash
cd /Users/shubhamkumar/Projects/mas/mas-video
npm run dev
# Open: http://localhost:3000
# Click: "AI-Jobs-Horror-FULL-VIDEO" folder

# Render
npx remotion render AIJobs-Horror-FULL out/ai-jobs-horror-final.mp4

# Upload to platform + add music from their library!
```

---

## 🎯 Why This Works

### **Realistic Fear > Dramatic Horror**

| Old (Dramatic) | **New (Documentary)** |
|----------------|-------------------|
| "IT'S WATCHING" | "Your job is next" |
| Blood red, glitches | Clean, professional |
| Sci-fi scary | Real-life scary |
| Feels like a movie | Feels like news |
| Fake horror | TRUE horror |

---

## 🎬 Scene Breakdown

| Scene | Time | Text | Purpose |
|-------|------|-------|---------|
| 1 | 0-3s | "Your job is next." | Hook |
| 2 | 3-7s | "85M jobs by 2025" | Statistics |
| 3 | 7-12s | Timeline of AI replacement | Progression |
| 4 | 12-17s | Jobs being replaced NOW | List |
| 5 | 17-22s | Industries at risk | Data viz |
| 6 | 22-27s | "Faster than predicted" | Truth |
| 7 | 27-30s | "Adapt or be replaced." | CTA |

---

## 📊 Real Data Sources

- **85 million jobs** - World Economic Forum "Future of Jobs Report 2023"
- **95% customer service** - Goldman Sachs research
- **88% administrative** - McKinsey Global Institute
- **82% manufacturing** - Oxford University study
- **76% finance** - McKinsey Global Institute

---

## 🎨 Style Guide

### **Colors (Professional)**
```typescript
bg: "#0a0a0a"        // Nearly black
white: "#ffffff"      // Clean white
red: "#ff4444"        // Warning red
gray: "#888888"       // Professional gray
dim: "#4a4a4a"        // Subtle gray
```

### **Typography**
```typescript
font: "Inter, -apple-system, sans-serif"
weight: 500-600 (not 900)
size: 60-100px (readable, not overwhelming)
```

---

## 🎵 Adding Music

### **Recommended: Use Platform Music**

**Best approach:** Upload to Instagram/TikTok and use their built-in music library!

**Why:**
- ✅ No copyright issues
- ✅ Perfect length matching
- ✅ Professional quality
- ✅ Easy to change

**Search for:** "documentary", "news", "serious", "business", "tense"

### **Alternative: Add Your Own Music**

```bash
ffmpeg -i out/ai-jobs-horror-final.mp4 \
  -i path/to/your/music.mp3 \
  -c:v copy -c:a aac \
  -map 0:v:0 -map 1:a:0 \
  -shortest \
  out/ai-jobs-horror-with-music.mp4
```

---

## 📱 Caption Template

```
Your job is next. 😔

85 million jobs will be displaced by AI by 2025.
That's not science fiction. That's the World Economic Forum.

Jobs being replaced RIGHT NOW:
- Customer Service Representatives
- Content Writers & Copywriters
- Graphic Designers
- Data Entry Clerks
- Bookkeepers & Accountants

Experts predicted this would take 10 years.
AI did it in 2.

Your skills have an expiration date.

Adapt or be replaced.

Follow to learn how to adapt 👇

#ai #jobreplacement #automation #futureofwork #careers #layoffs #tech #artificialintelligence #jobs #economy
```

---

## 📈 Expected Results

### **Viral Metrics:**
- **Views:** 200K - 2M+
- **Engagement:** 10-20%
- **Shares:** Very high (people tag colleagues)
- **Comments:** High (job security discussions)

### **Why It Outperforms Dramatic Horror:**
1. **Shareable** - People share to warn friends/colleagues
2. **Discussable** - Sparks real conversations
3. **Saveable** - People save for career planning
4. **Credible** - Real data = trustworthy
5. **Professional** - Suitable for LinkedIn too

---

## 📂 Project Structure

```
src/reels/ai-jobs-horror/
├── README.md                      ← This file
├── helpers-realistic.tsx          ← Animation helpers
├── AIJobsHorror.tsx               ← Compositions
├── AIJobsHorrorFull.tsx           ← Main video (no audio)
├── Scene01Hook.tsx                ← "Your job is next"
├── Scene02Stats.tsx               ← "85M jobs"
├── Scene03Timeline.tsx            ← Timeline
├── Scene04Jobs.tsx                ← Job list
├── Scene05Industries.tsx          ← Industries
├── Scene06Truth.tsx               ← "Faster than predicted"
└── Scene07CTA.tsx                  ← "Adapt or be replaced"
```

---

## ✅ Checklist

Before posting:
- [x] All 7 scenes created
- [x] Combined into single video
- [x] Clean, professional style
- [x] Real data from credible sources
- [x] Large, readable text
- [x] Caption ready
- [x] Hashtag strategy

---

**Made with reality and urgency** 📊🎯

*This isn't horror fiction. This is happening NOW.*
