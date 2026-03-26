# 🎬 MAS Video Creation Studio

> **Remotion-powered video generation for viral content**
> Create stunning Instagram Reels, TikToks, and YouTube Shorts with code

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

---

## 📁 Project Structure

```
mas-video/
├── src/
│   ├── Composition.tsx          # Main video composition
│   ├── Root.tsx                 # Root component with all videos
│   ├── reels/                   # Instagram Reels content
│   │   ├── ai-horror/          # 🎬 AI Horror Reel (NEW!)
│   │   │   ├── README.md       # AI Horror overview
│   │   │   ├── helpers-ai-horror.tsx
│   │   │   ├── AIHorrorReel.tsx
│   │   │   ├── AIHorrorScene01.tsx - AIHorrorScene08.tsx
│   │   │   └── ...
│   │   ├── R01Hook.tsx - R11Final.tsx
│   │   ├── ReelsComposition.tsx
│   │   └── helpers-reels.tsx
│   ├── viral/                   # Viral video series
│   │   ├── Scene01Feed.tsx - Scene17Final.tsx
│   │   ├── ViralComposition.tsx
│   │   └── helpers-viral.tsx
│   ├── film/                    # Film/cinematic components
│   ├── index.css
│   └── index.ts
├── docs/                        # Documentation
│   ├── AI_HORROR_REEL_GUIDE.md  # Complete AI Horror guide
│   └── QUICKSTART.md            # 5-minute quick start
├── public/                      # Static assets (images, fonts, sounds)
├── out/                         # Rendered video output directory
├── remotion.config.ts
├── package.json
└── README.md                    # This file
```

---

## 🎬 Available Videos

### 🆕 AI Horror Reel (2026)
- **Location:** `src/reels/ai-horror/`
- **Duration:** 30 seconds
- **Style:** Dark, glitchy, psychological horror
- **Theme:** AI surveillance & digital footprints
- **Docs:** [Complete Guide](docs/AI_HORROR_REEL_GUIDE.md) | [Quick Start](docs/QUICKSTART.md)
- **Scenes:** 8 scenes (2-6 seconds each)

### Viral Series
- **Location:** `src/viral/`
- **Scenes:** 17 scenes
- **Style:** Cinematic storytelling
- **Duration:** ~2 minutes

### Reels Series
- **Location:** `src/reels/`
- **Scenes:** 11 scenes (R01-R11)
- **Style:** Short-form content
- **Duration:** Variable

---

## 🎯 Creating Videos with Claude

### Step 1: **Planning Phase** (Content Strategy)

Work with Claude to plan your video:

```
"Act as a viral content writer. Create a scary AI-themed Instagram reel
that will terrify viewers. Target: Gen Z, Format: 9:16 vertical,
Duration: 30 seconds, Style: Dark, glitchy, horror-style"
```

**Key Elements to Define:**
- **Hook**: First 1-2 seconds to grab attention
- **Story Arc**: Beginning → Middle → Climax → Twist
- **Visual Style**: Colors, fonts, animations, effects
- **Audio**: Music, SFX, voiceover timing
- **Text Size**: Large, bold, readable on mobile
- **Pacing**: Fast cuts, quick transitions (viral style)

---

### Step 2: **Scene Breakdown** (Scripting)

Create a detailed scene-by-scene breakdown. See [AI Horror Guide](docs/AI_HORROR_REEL_GUIDE.md) for examples.

---

### Step 3: **Implementation** (Coding)

Work with Claude to implement each scene. Use the helper functions in existing files as templates.

#### Example Scene Structure:

```typescript
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, CenterText } from "../ai-horror/helpers-ai-horror";

export const MyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: H.bg }}>
      <CenterText fontSize={120} color={H.bloodRed}>
        YOUR TEXT HERE
      </CenterText>
    </AbsoluteFill>
  );
};
```

---

### Step 4: **Render & Export**

```bash
# Preview in browser
npm run dev

# Render video (MP4)
npx remotion render <CompositionName> out/video.mp4

# Render with custom settings
npx remotion render <CompositionName> out/video.mp4 \
  --sequence \
  --frames=0-90 \
  --fps=30 \
  --width=1080 \
  --height=1920
```

---

## 🎨 Best Practices for Viral Reels

### ✅ DO:
- **Use huge text** (80-150px for main text)
- **Fast cuts** (2-3 seconds per scene)
- **Bold colors** (high contrast)
- **Start with a hook** (first frame matters most)
- **Add music/sound effects** (essential for viral content)
- **Use 9:16 aspect ratio** (1080x1920 for Reels/TikTok)
- **Test on mobile** (most viewers watch on phone)

### ❌ DON'T:
- Don't use small text (anything under 40px)
- Don't use slow fades (too boring)
- Don't clutter the screen (keep it focused)
- Don't use low contrast (hard to see)
- Don't make scenes longer than 5 seconds
- Don't forget audio (silent videos don't go viral)

---

## 📱 Platform Specifications

| Platform | Resolution | FPS | Duration | Aspect Ratio |
|----------|------------|-----|----------|--------------|
| Instagram Reels | 1080x1920 | 30 | 15-60s | 9:16 |
| TikTok | 1080x1920 | 30 | 15-60s | 9:16 |
| YouTube Shorts | 1080x1920 | 30 | 15-60s | 9:16 |
| Instagram Stories | 1080x1920 | 30 | 15s | 9:16 |

---

## 🔧 Common Effects

### **Glitch Effect**
```typescript
const glitchOffset = Math.sin(frame * 0.8) * 10;
const redChannel = Math.random() > 0.9 ? 255 : 0;
const style = {
  transform: `translateX(${glitchOffset}px)`,
  filter: `url(#glitch)`,
  color: `rgb(${redChannel}, 0, 0)`
};
```

### **Shake Effect**
```typescript
const shake = (frame: number) => ({
  x: Math.sin(frame * 0.5) * 15,
  y: Math.cos(frame * 0.3) * 15
});
```

### **Typewriter Effect**
```typescript
const useTypeWriter = (text: string, speed: number) => {
  const frame = useCurrentFrame();
  const index = Math.floor(frame / speed);
  return text.slice(0, index);
};
```

### **Count-Up Animation**
```typescript
const useCount = (startFrame: number, duration: number, max: number) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, (frame - startFrame) / duration));
  return Math.floor(progress * max);
};
```

---

## 🎵 Adding Audio

```bash
# Place audio files in public/audio/
public/
├── audio/
│   ├── horror-ambience.mp3
│   ├── glitch-sound.mp3
│   └── viral-music.mp3

# Reference in composition
<audio ref={audioRef} src="/audio/horror-ambience.mp3" />
```

---

## 🚀 Deploy & Share

```bash
# Render final video
npx remotion render AIHorrorReel out/ai-horror-reel.mp4

# Upload to Instagram
1. Open Instagram app
2. Tap "+" button
3. Select "Reel"
4. Upload out/ai-horror-reel.mp4
5. Add caption, hashtags, location
6. Share!
```

---

## 📚 Resources

- **[AI Horror Reel Guide](docs/AI_HORROR_REEL_GUIDE.md)** - Complete guide for the AI horror reel
- **[Quick Start Guide](docs/QUICKSTART.md)** - 5-minute fast track
- **Remotion Docs**: https://www.remotion.dev/docs
- **Remotion Discord**: https://discord.gg/6VbNDqUuXr
- **Instagram Reels Specs**: https://developers.facebook.com/docs/instagram/reels/

---

## 🛠️ Troubleshooting

**Video not rendering?**
- Check composition name matches
- Ensure all imports are correct
- Verify no syntax errors

**Text too small?**
- Increase font size to 80-150px
- Test on mobile preview

**Animations not smooth?**
- Check FPS is set to 30
- Use `interpolate()` for smooth transitions

**Audio not playing?**
- Ensure audio file is in `public/` folder
- Check file format (MP3 recommended)

---

## 🎯 Next Steps

1. **Choose a video** → AI Horror, Viral, or Reels
2. **Plan your content** → Work with Claude on script
3. **Implement scenes** → Code each scene component
4. **Test & iterate** → Preview in browser, make changes
5. **Render final video** → Export MP4
6. **Share & go viral** → Upload to platforms

---

## 📊 Project Status

- ✅ **AI Horror Reel** - Complete (8 scenes, 30s)
- ✅ **Viral Series** - Complete (17 scenes)
- ✅ **Reels Series** - Complete (11 scenes)
- 🚧 **Film Series** - In progress

---

**Made with ❤️ and Remotion**

*For questions or issues, check the Remotion documentation or community Discord.*
