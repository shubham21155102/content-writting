# 🎬 AI Horror Reel

> A 30-second viral Instagram reel about AI surveillance

## 📁 Structure

```
ai-horror/
├── README.md                    # This file
├── helpers-ai-horror.tsx        # Animation helpers
├── AIHorrorReel.tsx             # All scene compositions
├── AIHorrorScene01.tsx          # "IT'S WATCHING" (0-2s)
├── AIHorrorScene02.tsx          # "847,293 DATA POINTS" (2-5s)
├── AIHorrorScene03.tsx          # "It Knows" trilogy (5-8s)
├── AIHorrorScene04.tsx          # "IT'S LISTENING" (8-12s)
├── AIHorrorScene05.tsx          # "CREATING YOUR CLONE" (12-18s)
├── AIHorrorScene06.tsx          # "The Truth" (18-24s)
├── AIHorrorScene07.tsx          # "The Threat" (24-28s)
└── AIHorrorScene08.tsx          # "DELETE EVERYTHING" (28-30s)
```

## 🚀 Quick Start

```bash
# Preview all scenes
npm run dev
# Open: http://localhost:3000
# Click: "🎬 AI Horror Reel (Viral)" folder

# Render individual scenes
npx remotion render AIHorror-01 out/scene-01.mp4
npx remotion render AIHorror-02 out/scene-02.mp4
# ... etc for all 8 scenes
```

## 📖 Documentation

- **[Complete Guide](../../../docs/AI_HORROR_REEL_GUIDE.md)** - Full documentation with strategy
- **[Quick Start](../../../docs/QUICKSTART.md)** - 5-minute fast track

## 🎯 Overview

**Duration:** 30 seconds (900 frames at 30fps)
**Resolution:** 1080x1920 (9:16 vertical)
**Style:** Dark, glitchy, psychological horror
**Target:** Gen Z + Millennials

## 🎨 Key Features

- ✅ Huge text (80-140px) - Mobile-optimized
- ✅ Fast cuts (2-5s per scene) - Viral pacing
- ✅ Glitch effects - Eye-catching
- ✅ Data visualization - Counting numbers
- ✅ Heartbeat animation - Emotional engagement
- ✅ Mirror effect - Psychological horror
- ✅ Screen shake - Climax intensity
- ✅ Strong CTA - "Follow if you're scared"

## 📊 Scene Breakdown

| Scene | Duration | Text | Purpose |
|-------|----------|------|---------|
| 1 | 0-2s | "IT'S WATCHING" | Hook |
| 2 | 2-5s | "847,293 DATA POINTS" | Evidence |
| 3 | 5-8s | "It Knows" trilogy | Revelation |
| 4 | 8-12s | "IT'S LISTENING" | Immediate threat |
| 5 | 12-18s | "CREATING YOUR CLONE" | Digital twin |
| 6 | 18-24s | "The Truth" (3 reveals) | Escalation |
| 7 | 24-28s | "YOUR DIGITAL TWIN IS READY" | Climax |
| 8 | 28-30s | "DELETE EVERYTHING. NOW." | CTA |

## 🎨 Customization

### Change Colors
Edit `helpers-ai-horror.tsx`:
```typescript
export const H = {
  bg: "#000000",
  bloodRed: "#FF0000",
  neonGreen: "#00FF00",
  // ... edit these
};
```

### Change Text
Edit any scene file:
```typescript
<CenterText fontSize={140} color={H.bloodRed}>
  YOUR TEXT HERE
</CenterText>
```

### Adjust Timing
Edit `AIHorrorReel.tsx`:
```typescript
durationInFrames={60} // 30fps = 2 seconds
```

## 📱 Platform Specs

| Platform | Resolution | Duration | Format |
|----------|------------|----------|--------|
| Instagram Reels | 1080x1920 | 30s | 9:16 |
| TikTok | 1080x1920 | 30s | 9:16 |
| YouTube Shorts | 1080x1920 | 30s | 9:16 |

## 🔊 Audio Tips

1. Dark ambient music (background)
2. Glitch sounds (scenes 2, 4, 6)
3. Heartbeat (scene 3)
4. Bass drop (scene 7)
5. Sudden silence (scene 8)

**Free audio sources:**
- YouTube Audio Library
- Freesound.org
- Zapsplat.com

## 📈 Expected Results

- **Views:** 100K - 1M+
- **Engagement:** 8-15%
- **Shares:** High (fear drives sharing)
- **Saves:** High (reference content)

---

**Made with fear and code** 😈🎬
