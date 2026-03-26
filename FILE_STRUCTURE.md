# 📁 File Structure Overview

## ✅ Organized Structure

```
mas-video/
│
├── 📄 README.md                          # Main project documentation
├── 📄 remotion.config.ts                 # Remotion configuration
├── 📄 package.json                       # Dependencies & scripts
│
├── 📂 docs/                              # Documentation
│   ├── AI_HORROR_REEL_GUIDE.md          # Complete AI Horror guide
│   └── QUICKSTART.md                    # 5-minute quick start
│
├── 📂 public/                            # Static assets
│   └── 📂 audio/                         # Music & sound effects
│       ├── horror-ambience.mp3
│       ├── glitch-sound.mp3
│       └── viral-music.mp3
│
├── 📂 src/                               # Source code
│   ├── 📄 index.ts                       # Entry point
│   ├── 📄 index.css                      # Global styles
│   ├── 📄 Root.tsx                       # Root with all compositions
│   ├── 📄 Composition.tsx                # Main composition
│   │
│   ├── 📂 reels/                         # Instagram Reels
│   │   ├── 📂 ai-horror/                 # 🎬 AI Horror Reel (NEW!)
│   │   │   ├── README.md                 # AI Horror overview
│   │   │   ├── helpers-ai-horror.tsx     # Animation helpers
│   │   │   ├── AIHorrorReel.tsx          # All compositions
│   │   │   ├── AIHorrorScene01.tsx       # "IT'S WATCHING" (0-2s)
│   │   │   ├── AIHorrorScene02.tsx       # "847,293 DATA POINTS" (2-5s)
│   │   │   ├── AIHorrorScene03.tsx       # "It Knows" trilogy (5-8s)
│   │   │   ├── AIHorrorScene04.tsx       # "IT'S LISTENING" (8-12s)
│   │   │   ├── AIHorrorScene05.tsx       # "CREATING YOUR CLONE" (12-18s)
│   │   │   ├── AIHorrorScene06.tsx       # "The Truth" (18-24s)
│   │   │   ├── AIHorrorScene07.tsx       # "The Threat" (24-28s)
│   │   │   └── AIHorrorScene08.tsx       # "DELETE EVERYTHING" (28-30s)
│   │   │
│   │   ├── R01Hook.tsx - R11Final.tsx   # Existing reel scenes
│   │   ├── ReelsComposition.tsx
│   │   └── helpers-reels.tsx
│   │
│   ├── 📂 viral/                         # Viral video series
│   │   ├── Scene01Feed.tsx - Scene17Final.tsx
│   │   ├── ViralComposition.tsx
│   │   └── helpers-viral.tsx
│   │
│   └── 📂 film/                          # Film/cinematic components
│
└── 📂 out/                               # Rendered videos (output)
    ├── scene-01.mp4
    ├── scene-02.mp4
    └── ...
```

---

## 🎯 AI Horror Reel - File Details

### **Helper Functions** (`helpers-ai-horror.tsx`)
- `useGlitch()` - Glitch effect
- `useShake()` - Screen shake
- `useHeartbeat()` - Heartbeat pulse
- `useTypewriter()` - Typewriter effect
- `useCount()` - Count-up animation
- `useStrobe()` - Strobe flash
- `useZoom()` - Zoom effect
- `useSlideIn()` - Slide in from bottom

### **Components** (`helpers-ai-horror.tsx`)
- `GlitchText` - Glitchy text component
- `DataStream` - Matrix-style data stream
- `CameraAperture` - Camera lens animation
- `Microphone` - Mic with sound wave
- `MirrorEffect` - Mirror reflection effect
- `CenterText` - Centered text container

### **Scene Files**

| File | Duration | Text | Purpose |
|------|----------|------|---------|
| `AIHorrorScene01.tsx` | 2s | "IT'S WATCHING" | Hook |
| `AIHorrorScene02.tsx` | 3s | "847,293 DATA POINTS" | Evidence |
| `AIHorrorScene03.tsx` | 3s | "It Knows" trilogy | Revelation |
| `AIHorrorScene04.tsx` | 4s | "IT'S LISTENING" | Immediate threat |
| `AIHorrorScene05.tsx` | 6s | "CREATING YOUR CLONE" | Digital twin |
| `AIHorrorScene06.tsx` | 6s | "The Truth" (3 reveals) | Escalation |
| `AIHorrorScene07.tsx` | 4s | "YOUR DIGITAL TWIN IS READY" | Climax |
| `AIHorrorScene08.tsx` | 3s | "DELETE EVERYTHING. NOW." | CTA |

---

## 🚀 Quick Navigation

### **For Users:**
- Start here: [README.md](../README.md)
- Quick start: [docs/QUICKSTART.md](../docs/QUICKSTART.md)
- Full guide: [docs/AI_HORROR_REEL_GUIDE.md](../docs/AI_HORROR_REEL_GUIDE.md)

### **For Developers:**
- AI Horror code: `src/reels/ai-horror/`
- Helpers: `src/reels/ai-horror/helpers-ai-horror.tsx`
- Compositions: `src/reels/ai-horror/AIHorrorReel.tsx`
- Root: `src/Root.tsx`

---

## 📊 File Sizes

```
AI Horror Reel:
├── helpers-ai-horror.tsx    ~8 KB  (helpers & components)
├── AIHorrorScene01.tsx      ~1.5 KB (hook)
├── AIHorrorScene02.tsx      ~2.5 KB (data points)
├── AIHorrorScene03.tsx      ~2.2 KB (trilogy)
├── AIHorrorScene04.tsx      ~2.3 KB (listening)
├── AIHorrorScene05.tsx      ~2.5 KB (clone)
├── AIHorrorScene06.tsx      ~2.2 KB (truth)
├── AIHorrorScene07.tsx      ~2.3 KB (threat)
├── AIHorrorScene08.tsx      ~3 KB  (CTA)
└── AIHorrorReel.tsx         ~2.8 KB (compositions)
```

**Total:** ~30 KB of code

---

## ✅ Organization Benefits

### **Before:**
- ❌ Files scattered across `src/reels/`
- ❌ Mixed with existing reel files
- ❌ No dedicated documentation
- ❌ Hard to find AI Horror files

### **After:**
- ✅ Dedicated `ai-horror/` folder
- ✅ Separate documentation (`docs/`)
- ✅ Clear structure with README
- ✅ Easy to maintain and extend
- ✅ Reusable helpers
- ✅ Consistent naming

---

## 🎨 Naming Conventions

### **Files:**
- Scenes: `AIHorrorScene[01-08].tsx`
- Helpers: `helpers-ai-horror.tsx`
- Compositions: `AIHorrorReel.tsx`
- Docs: `AI_HORROR_REEL_GUIDE.md`

### **Functions:**
- Helpers: `use[Name]()`
- Components: `[Name]()` or `<[Name] />`

### **Colors:**
- Export object: `H` (Horror)
- Color names: `bg`, `bloodRed`, `neonGreen`, `white`, `dim`

---

## 🔧 Import Paths

### **From AI Horror files:**
```typescript
// Within ai-horror folder
import { H, useGlitch } from "./helpers-ai-horror";

// From Root.tsx
import { AIHorror01Composition } from "./reels/ai-horror/AIHorrorReel";
```

---

## 📝 Maintenance

### **Adding New Scenes:**
1. Create `AIHorrorScene09.tsx` in `src/reels/ai-horror/`
2. Add composition in `AIHorrorReel.tsx`
3. Export in `Root.tsx`

### **Updating Helpers:**
1. Edit `helpers-ai-horror.tsx`
2. All scenes automatically get new helpers

### **Updating Docs:**
1. Edit files in `docs/`
2. Keep README.md in sync

---

**Clean, organized, and ready to go!** 🎬✨
