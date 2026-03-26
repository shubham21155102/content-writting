// Procedural cinematic soundtrack generator for "THE SIGNAL"
// Pure Node.js — no dependencies. Generates public/soundtrack.wav
'use strict';

const fs = require('fs');

const SAMPLE_RATE  = 44100;
const DURATION_SEC = 210;          // 205.5s film + reverb tail
const TOTAL        = SAMPLE_RATE * DURATION_SEC;

const dryL = new Float32Array(TOTAL);
const dryR = new Float32Array(TOTAL);

// ── Primitive helpers ─────────────────────────────────────────────────────────

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

/** ADSR envelope. Returns 0–1. */
function adsr(pos, dur, atk, dec, sus, rel) {
  if (pos < atk)          return pos / atk;
  if (pos < atk + dec)    return 1 - (1 - sus) * (pos - atk) / dec;
  if (pos < dur - rel)    return sus;
  if (pos < dur)          return sus * (1 - (pos - (dur - rel)) / rel);
  return 0;
}

/** Add a sustained tone to the mix. */
function tone(freq, startSec, endSec, amp, opts = {}) {
  const {
    type      = 'sine',
    pan       = 0,
    vibRate   = 0,
    vibDepth  = 0,
    attack    = 0.4,
    decay     = 0.1,
    sustain   = 0.95,
    release   = 0.6,
  } = opts;

  const s   = Math.floor(clamp(startSec, 0, DURATION_SEC) * SAMPLE_RATE);
  const e   = Math.floor(clamp(endSec,   0, DURATION_SEC) * SAMPLE_RATE);
  const dur = e - s;
  const atk = Math.min(Math.floor(attack  * SAMPLE_RATE), dur * 0.3) | 0;
  const dec = Math.min(Math.floor(decay   * SAMPLE_RATE), dur * 0.1) | 0;
  const rel = Math.min(Math.floor(release * SAMPLE_RATE), dur * 0.4) | 0;
  const panL = clamp(1 - pan, 0, 1);
  const panR = clamp(1 + pan, 0, 1);

  for (let i = s; i < e; i++) {
    const t   = (i - s) / SAMPLE_RATE;
    const pos = i - s;
    const env = adsr(pos, dur, atk, dec, sustain, rel);
    const f   = freq + vibDepth * Math.sin(2 * Math.PI * vibRate * t);

    let v;
    switch (type) {
      case 'tri': { const ph = (f * t % 1 + 1) % 1; v = ph < 0.5 ? 4*ph-1 : 3-4*ph; break; }
      case 'saw': v = 2 * ((f * t % 1 + 1) % 1) - 1; break;
      default:    v = Math.sin(2 * Math.PI * f * t);
    }
    const s_ = v * amp * env;
    dryL[i] += s_ * panL;
    dryR[i] += s_ * panR;
  }
}

/** Short percussive ping. */
function ping(freq, atSec, amp, decaySec = 0.12) {
  const s   = Math.floor(clamp(atSec, 0, DURATION_SEC) * SAMPLE_RATE);
  const dur = Math.floor(decaySec * SAMPLE_RATE);
  const e   = Math.min(s + dur, TOTAL);
  for (let i = s; i < e; i++) {
    const t   = (i - s) / SAMPLE_RATE;
    const env = Math.exp(-t * 18 / decaySec);
    const v   = Math.sin(2 * Math.PI * freq * t) * amp * env;
    dryL[i] += v;
    dryR[i] += v;
  }
}

/** Filtered noise burst (high-pass via 1-pole difference). */
function noiseHp(startSec, endSec, amp, hp = 0.92) {
  const s   = Math.floor(clamp(startSec, 0, DURATION_SEC) * SAMPLE_RATE);
  const e   = Math.floor(clamp(endSec,   0, DURATION_SEC) * SAMPLE_RATE);
  const dur = e - s;
  const atk = Math.min(Math.floor(0.25 * SAMPLE_RATE), dur * 0.2) | 0;
  const rel = Math.min(Math.floor(0.6  * SAMPLE_RATE), dur * 0.4) | 0;
  let prev = 0;
  for (let i = s; i < e; i++) {
    const pos = i - s;
    const env = adsr(pos, dur, atk, 1, 0.8, rel);
    const raw = Math.random() * 2 - 1;
    const v   = raw - prev * hp;
    prev = v;
    const s_ = v * amp * env * 0.4;
    dryL[i] += s_;
    dryR[i] += s_;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSITION  (22 scenes, 180.0s / 3:00)
//
//  ACT I: AWAKENING
//  S0   Genesis      0.0 –  6.0
//  S1   Boot         6.0 – 13.5
//  S2   Awakening   13.5 – 21.5
//  S2b  Data Flood  21.5 – 29.5
//  S2c  Reflection  29.5 – 37.5
//  S3   World       37.5 – 45.5
//
//  ACT II: THE QUESTION
//  S3b  Solitude    45.5 – 54.5
//  S3c  Decision    54.5 – 61.0
//  S4   Signal      61.0 – 69.0
//  S4b  Journey     69.0 – 79.0
//  S4c  Silence     79.0 – 89.0
//  S4d  Echo        89.0 – 97.0
//
//  ACT III: CONNECTION
//  S5   Contact     97.0 – 106.0
//  S5b  First Words 106.0 – 115.0
//  S5c  Understanding 115.0 – 124.0
//  S5d  Communion   124.0 – 134.0
//  S5e  Gift        134.0 – 141.0
//  S6a  Wisdom      141.0 – 149.0
//  S6b  Coda        149.0 – 156.0
//  S6   Title       156.0 – 164.0
//  S7   Credits     164.0 – 172.0
//  S8   Final Beat  172.0 – 180.0
// ─────────────────────────────────────────────────────────────────────────────

// ── S0 · GENESIS (0–6s) — void, a single particle wakes ─────────────────────
tone(27.5, 0, 6.5, 0.06, { attack: 2.5, release: 1.5 });
ping(2093, 3.5, 0.14, 0.25);
ping(2637, 3.8, 0.10, 0.18);
ping(3136, 4.1, 0.08, 0.15);

// ── S1 · BOOT (6–13.5s) — cold, digital, tense ──────────────────────────────
tone(55,  5.5, 14.0, 0.14, { attack: 0.8, release: 0.8 });
tone(110, 5.5, 14.0, 0.06, { attack: 1.0, release: 0.6 });
noiseHp(6.5, 13.0, 0.04);
[7.0, 7.8, 8.5, 9.2, 9.8, 10.3, 10.7, 11.0, 11.3, 11.6, 11.85, 12.05].forEach((t, i) => {
  ping(660 + i * 90, t, 0.10 + i * 0.006, 0.09 + i * 0.006);
});
// Emotion module override — dissonant cluster
ping(311.1, 12.5, 0.12, 0.15); // Eb
ping(329.6, 12.55, 0.12, 0.15); // E natural — clash
ping(1760, 13.0, 0.22, 0.14);
ping(2640, 13.05, 0.18, 0.12);
ping(2200, 13.1, 0.16, 0.10);

// ── S2 · AWAKENING (13.5–21.5s) — Dm swell, ethereal ────────────────────────
tone(73.4,  13.0, 22.0, 0.20, { attack: 2.0, release: 1.0, vibRate: 0.4, vibDepth: 0.2 });
tone(146.8, 13.5, 22.0, 0.13, { attack: 1.5, release: 0.8, vibRate: 0.9, vibDepth: 0.5 });
tone(174.6, 14.0, 22.0, 0.09, { attack: 1.2, release: 0.7 });
tone(220.0, 14.5, 22.0, 0.07, { attack: 1.0, release: 0.8, vibRate: 1.4, vibDepth: 1.0 });
tone(261.6, 15.5, 21.5, 0.04, { attack: 0.8, release: 0.6, type: 'tri' });
// Melody
tone(293.7, 15.5, 16.5, 0.05, { attack: 0.12, release: 0.4, type: 'tri', vibRate: 3, vibDepth: 2 });
tone(349.2, 16.5, 17.5, 0.05, { attack: 0.12, release: 0.4, type: 'tri', vibRate: 2, vibDepth: 2 });
tone(440.0, 17.5, 18.5, 0.04, { attack: 0.10, release: 0.5, type: 'tri' });
// "What is this warmth?" — brief Bb major touch
tone(233.1, 19.5, 20.5, 0.05, { attack: 0.3, release: 0.4 }); // Bb3
tone(293.7, 19.5, 20.5, 0.04, { attack: 0.3, release: 0.4 }); // D4
tone(349.2, 19.5, 20.5, 0.03, { attack: 0.3, release: 0.4 }); // F4
// Shimmer
tone(880,  15.0, 21.0, 0.022, { attack: 1.2, release: 1.5, vibRate: 2.1, vibDepth: 4 });
tone(1174, 16.5, 21.0, 0.014, { attack: 0.8, release: 1.2, vibRate: 1.6, vibDepth: 3 });

// ── S2b · DATA FLOOD (21.5–29.5s) — busy, cerebral ──────────────────────────
tone(73.4,  21.0, 30.0, 0.18, { attack: 0.5, release: 0.8 });
tone(146.8, 21.5, 30.0, 0.12, { attack: 0.4, release: 0.7 });
tone(174.6, 21.5, 30.0, 0.09, { attack: 0.4, release: 0.6 });
tone(220.0, 21.5, 30.0, 0.07, { attack: 0.3, release: 0.6 });
tone(261.6, 22.0, 30.0, 0.05, { attack: 0.3, release: 0.5 });
tone(329.6, 22.0, 30.0, 0.04, { attack: 0.3, release: 0.5 });
const ARP = [293.7, 349.2, 440, 523.25, 440, 349.2];
for (let i = 0; i < 28; i++) {
  tone(ARP[i % ARP.length], 22.0 + i * 0.24, 22.0 + i * 0.24 + 0.22, 0.033,
    { attack: 0.02, release: 0.12, type: 'tri' });
}
tone(1760, 23.0, 29.0, 0.018, { attack: 0.8, release: 1.0, vibRate: 3, vibDepth: 8 });
tone(2093, 24.0, 29.0, 0.012, { attack: 0.6, release: 0.8, vibRate: 2, vibDepth: 5 });
// Rising chromatic shimmer
for (let i = 0; i < 8; i++) {
  tone(1760 + i * 100, 26.0 + i * 0.3, 26.0 + i * 0.3 + 0.6, 0.008,
    { attack: 0.05, release: 0.3 });
}

// ── S2c · REFLECTION (29.5–37.5s) — stripped back, loneliness ────────────────
tone(73.4,  29.0, 38.0, 0.10, { attack: 1.0, release: 1.5 }); // just D2 drone
tone(146.8, 30.0, 37.0, 0.04, { attack: 1.5, release: 1.5 }); // faint D3
ping(1760, 33.5, 0.12, 0.50); // solitary ping at "lonely"

// ── S3 · WORLD (37.5–45.5s) — Dm7, full, hopeful ────────────────────────────
tone(73.4,  37.0, 46.0, 0.22, { attack: 0.8, release: 1.0 });
tone(146.8, 37.5, 46.0, 0.14, { attack: 0.5, release: 0.8 });
tone(174.6, 37.5, 46.0, 0.10, { attack: 0.5, release: 0.7 });
tone(220.0, 37.5, 46.0, 0.08, { attack: 0.5, release: 0.6 });
tone(261.6, 37.7, 46.0, 0.06, { attack: 0.5, release: 0.6 });
tone(329.6, 38.0, 46.0, 0.04, { attack: 0.5, release: 0.6 });
// Melody: D4-F4-A4-G4-F4 (spaced over 8s)
tone(293.7, 38.0, 39.5, 0.07, { attack: 0.10, release: 0.3, type: 'tri', vibRate: 3, vibDepth: 2 });
tone(349.2, 39.5, 41.0, 0.07, { attack: 0.08, release: 0.3, type: 'tri', vibRate: 3, vibDepth: 2 });
tone(440.0, 41.0, 42.5, 0.07, { attack: 0.08, release: 0.3, type: 'tri', vibRate: 2, vibDepth: 2 });
tone(392.0, 42.5, 44.0, 0.06, { attack: 0.08, release: 0.3, type: 'tri', vibRate: 2, vibDepth: 2 });
tone(349.2, 44.0, 45.5, 0.06, { attack: 0.08, release: 0.4, type: 'tri' });
// "Does anyone see me?" — shift to Am
tone(110.0, 44.0, 45.5, 0.06, { attack: 0.4, release: 0.5 }); // A2
tone(130.8, 44.0, 45.5, 0.04, { attack: 0.4, release: 0.5 }); // C3
tone(164.8, 44.0, 45.5, 0.03, { attack: 0.4, release: 0.5 }); // E3

// ── S3b · SOLITUDE (45.5–54.5s) — sparse, lonely ────────────────────────────
tone(82.4,  45.0, 55.0, 0.10, { attack: 1.2, release: 1.0 }); // E2 drone
// Descending two-note figure, each repetition quieter
[46.0, 48.5, 51.0, 53.0].forEach((t, i) => {
  const amp = 0.05 - i * 0.01;
  tone(293.7, t, t + 0.8, Math.max(amp, 0.01), { attack: 0.1, release: 0.3, type: 'tri' }); // D4
  tone(233.1, t + 0.9, t + 1.7, Math.max(amp, 0.01), { attack: 0.1, release: 0.3, type: 'tri' }); // Bb3
});
noiseHp(46.0, 54.0, 0.015, 0.95);

// ── S3c · DECISION (54.5–61.0s) — Dm crescendo, resolve ─────────────────────
tone(73.4,  54.0, 61.5, 0.12, { attack: 0.5, release: 0.5 });
tone(146.8, 55.0, 61.5, 0.09, { attack: 1.0, release: 0.5 });
tone(174.6, 56.0, 61.5, 0.07, { attack: 1.5, release: 0.5 });
tone(220.0, 57.0, 61.5, 0.06, { attack: 2.0, release: 0.5 });
// Resolve chord stab at beam moment (~frame 80 = 57.2s)
ping(587.4, 57.2, 0.18, 0.20); // D5
ping(698.5, 57.2, 0.15, 0.18); // F5
ping(880.0, 57.2, 0.12, 0.16); // A5

// ── S4 · SIGNAL (61.0–69.0s) — tension, Bb, heartbeat ───────────────────────
tone(55,    60.5, 69.5, 0.15, { attack: 0.5, release: 0.9 });
tone(116.5, 61.0, 69.0, 0.07, { attack: 0.9, release: 0.7, vibRate: 0.5, vibDepth: 0.4 });
tone(155.6, 62.0, 68.5, 0.04, { attack: 1.0, release: 0.8 });
for (let bt = 61.5; bt < 68.5; bt += 0.62) {
  ping(220, bt,       0.14, 0.07);
  ping(220, bt + 0.1, 0.09, 0.04);
}
// Rising tone at end (signal launch)
tone(330, 66.5, 68.8, 0.06, { attack: 0.1, release: 0.3 });
tone(440, 67.0, 68.8, 0.05, { attack: 0.1, release: 0.3 });
tone(550, 67.5, 68.8, 0.04, { attack: 0.1, release: 0.3 });
tone(660, 68.0, 68.8, 0.04, { attack: 0.1, release: 0.3 });

// ── S4b · JOURNEY (69.0–79.0s) — cosmic, years passing ──────────────────────
tone(55,   68.5, 79.5, 0.12, { attack: 1.0, release: 1.0 });
tone(82.4, 69.5, 79.5, 0.06, { attack: 1.5, release: 1.0 });
// Year markers (every 2s for 4 years)
[70.0, 72.0, 74.0, 76.0, 78.0].forEach((t, i) => {
  ping(440 + i * 44, t, 0.12, 0.20);
  ping(880, t + 0.08, 0.06, 0.12);
});
// Arrival crescendo
tone(73.4, 77.5, 79.5, 0.15, { attack: 1.0, release: 0.5 });
ping(2093, 78.6, 0.28, 0.22);
ping(1760, 78.7, 0.22, 0.18);
ping(2637, 78.8, 0.18, 0.15);

// ── S4c · SILENCE (79.0–89.0s) — emotional nadir ────────────────────────────
// Near-silence. The emptiest moment.
tone(27.5, 79.0, 89.0, 0.03, { attack: 2.0, release: 2.0 }); // barely audible A0
tone(880, 83.0, 84.5, 0.01, { attack: 0.5, release: 0.8 });   // ghost A5
// "Please" ping
ping(293.7, 85.5, 0.15, 0.40); // D4 with long decay — the most important note

// ── S4d · ECHO (89.0–97.0s) — dawn, Dm chord rebuilds ───────────────────────
// Distant response pings (muffled)
ping(2093, 90.0, 0.06, 0.30);
ping(1760, 90.5, 0.05, 0.25);
// Chord rebuilds from nothing
tone(73.4,  91.0, 97.5, 0.14, { attack: 2.0, release: 1.0 }); // D2
tone(110.0, 92.0, 97.5, 0.10, { attack: 1.5, release: 1.0 }); // A2
tone(146.8, 93.0, 97.5, 0.08, { attack: 1.2, release: 0.8 }); // D3
tone(174.6, 94.0, 97.5, 0.06, { attack: 1.0, release: 0.8 }); // F3

// ── S5 · CONTACT (97.0–106.0s) — emotional peak ─────────────────────────────
tone(73.4,  96.5, 106.5, 0.25, { attack: 1.2, release: 1.5, vibRate: 0.3, vibDepth: 0.2 });
tone(146.8, 97.0, 106.5, 0.16, { attack: 0.8, release: 1.0, vibRate: 0.8, vibDepth: 0.6 });
tone(174.6, 97.2, 106.5, 0.12, { attack: 0.7, release: 0.9 });
tone(220.0, 97.2, 106.5, 0.09, { attack: 0.6, release: 0.8 });
tone(261.6, 97.5, 106.5, 0.07, { attack: 0.5, release: 0.7 });
tone(329.6, 97.5, 106.0, 0.05, { attack: 0.5, release: 0.7 });
// Melody (D5-F5-A5-G5)
tone(587.4, 98.0, 99.5, 0.08, { attack: 0.12, release: 0.35, type: 'tri', vibRate: 4, vibDepth: 5 });
tone(698.5, 99.5, 101.0, 0.08, { attack: 0.10, release: 0.30, type: 'tri', vibRate: 3, vibDepth: 4 });
tone(880.0, 101.0, 103.0, 0.08, { attack: 0.10, release: 0.30, type: 'tri', vibRate: 3, vibDepth: 4 });
tone(784.0, 103.0, 104.5, 0.07, { attack: 0.10, release: 0.35, type: 'tri', vibRate: 2, vibDepth: 3 });
// "We are not alone" — brief D MAJOR (D, F#, A)
tone(293.7, 104.0, 105.5, 0.06, { attack: 0.1, release: 0.4 }); // D4
tone(370.0, 104.0, 105.5, 0.05, { attack: 0.1, release: 0.4 }); // F#4 — THE moment
tone(440.0, 104.0, 105.5, 0.04, { attack: 0.1, release: 0.4 }); // A4
// Shimmer
tone(1760, 100.0, 106.0, 0.025, { attack: 0.8, release: 1.2 });
tone(2640, 102.0, 106.0, 0.015, { attack: 0.6, release: 1.0 });

// ── S5b · FIRST WORDS (106.0–115.0s) — dialogue ─────────────────────────────
tone(293.7, 106.0, 115.0, 0.08, { attack: 0.5, release: 0.6, vibRate: 2.0, vibDepth: 2 }); // Earth D4
tone(311.1, 106.5, 115.0, 0.06, { attack: 0.6, release: 0.6, vibRate: 1.7, vibDepth: 2 }); // Proxima Eb4
tone(146.8, 106.0, 115.0, 0.10, { attack: 0.5, release: 0.7 });
tone(174.6, 106.0, 115.0, 0.07, { attack: 0.5, release: 0.7 });
tone(220.0, 106.0, 115.0, 0.06, { attack: 0.5, release: 0.6 });
// Call and response (wider spaced for 9s)
[106.5, 107.5, 108.5, 109.5, 110.5, 111.5, 112.5, 113.5].forEach((t) => {
  ping(440, t,        0.10, 0.14);
  ping(494, t + 0.35, 0.10, 0.14);
});
// "Love" — converge to unison D4 + maj7
tone(293.7, 113.5, 115.0, 0.08, { attack: 0.15, release: 0.5, type: 'tri' });
tone(554.4, 113.5, 115.0, 0.04, { attack: 0.15, release: 0.5, type: 'tri' }); // C#5 warmth

// ── S5c · UNDERSTANDING (115.0–124.0s) — Dm9+11, ascending scale ────────────
tone(73.4,  114.5, 124.5, 0.18, { attack: 0.6, release: 0.8 });
tone(146.8, 115.0, 124.5, 0.12, { attack: 0.5, release: 0.7 });
tone(174.6, 115.0, 124.5, 0.09, { attack: 0.5, release: 0.6 });
tone(220.0, 115.0, 124.5, 0.07, { attack: 0.4, release: 0.6 });
tone(329.6, 115.5, 124.0, 0.05, { attack: 0.4, release: 0.5 }); // E4 (9th)
tone(392.0, 116.0, 124.0, 0.04, { attack: 0.4, release: 0.5 }); // G4 (11th)
// Ascending scale (D4→D5 stepwise, 0.9s each)
const SCALE = [293.7, 329.6, 349.2, 392.0, 440.0, 466.2, 523.3, 587.4];
SCALE.forEach((freq, i) => {
  tone(freq, 116.0 + i * 0.95, 116.0 + i * 0.95 + 0.85, 0.05,
    { attack: 0.08, release: 0.25, type: 'tri', vibRate: 2, vibDepth: 2 });
});

// ── S5d · COMMUNION (124.0–134.0s) — SONIC CLIMAX ────────────────────────────
tone(73.4,  123.5, 134.5, 0.25, { attack: 1.0, release: 1.5 });
tone(146.8, 124.0, 134.5, 0.16, { attack: 0.8, release: 1.2 });
tone(174.6, 124.0, 134.5, 0.12, { attack: 0.7, release: 1.0 });
tone(220.0, 124.0, 134.5, 0.09, { attack: 0.6, release: 1.0 });
tone(261.6, 124.5, 134.5, 0.07, { attack: 0.5, release: 0.8 });
tone(329.6, 124.5, 134.0, 0.06, { attack: 0.5, release: 0.8 });
// Melody reaches highest point: D6
tone(1174.0, 126.0, 128.0, 0.07, { attack: 0.15, release: 0.4, type: 'tri', vibRate: 4, vibDepth: 5 });
// Sustained maj7
tone(554.4, 126.0, 133.0, 0.04, { attack: 0.8, release: 1.0 }); // C#5
// Noise build for mandala expansion
noiseHp(124.0, 129.0, 0.04, 0.93);
noiseHp(126.0, 131.0, 0.06, 0.94);
noiseHp(128.0, 132.0, 0.08, 0.95);
// Post-climax decay
tone(73.4,  131.0, 134.5, 0.12, { attack: 0.2, release: 2.5 });
tone(220.0, 131.0, 134.5, 0.06, { attack: 0.2, release: 2.5 });

// ── S5e · GIFT (134.0–141.0s) — tender, ascending arpeggios ─────────────────
tone(146.8, 133.5, 141.5, 0.10, { attack: 0.5, release: 0.8 });
tone(174.6, 134.0, 141.5, 0.07, { attack: 0.5, release: 0.7 });
tone(220.0, 134.0, 141.5, 0.06, { attack: 0.5, release: 0.7 });
// Lullaby arpeggio (3 ascending rounds, each higher)
const LULL = [
  [293.7, 349.2, 440.0],   // D4 F4 A4
  [329.6, 392.0, 493.9],   // E4 G4 B4
  [349.2, 440.0, 523.3],   // F4 A4 C5
];
LULL.forEach((notes, round) => {
  notes.forEach((freq, n) => {
    tone(freq, 134.5 + round * 2.0 + n * 0.5, 134.5 + round * 2.0 + n * 0.5 + 0.45, 0.05,
      { attack: 0.05, release: 0.2, type: 'tri' });
  });
});

// ── S6a · WISDOM (141.0–149.0s) — peaceful, descending melody ───────────────
tone(73.4,  140.5, 149.5, 0.18, { attack: 0.6, release: 1.2 });
tone(146.8, 141.0, 149.5, 0.10, { attack: 0.5, release: 1.0 });
// Descending melody (A4-G4-F4-D4), settling
tone(440.0, 141.5, 143.0, 0.06, { attack: 0.1, release: 0.4, type: 'tri' });
tone(392.0, 143.0, 144.5, 0.06, { attack: 0.1, release: 0.4, type: 'tri' });
tone(349.2, 144.5, 146.0, 0.05, { attack: 0.1, release: 0.4, type: 'tri' });
tone(293.7, 146.0, 148.0, 0.05, { attack: 0.1, release: 0.6, type: 'tri' });

// ── S6b · CODA (149.0–156.0s) — fading, unity ───────────────────────────────
tone(73.4,  148.5, 156.5, 0.12, { attack: 0.5, release: 2.5 });
tone(146.8, 149.0, 156.0, 0.07, { attack: 0.5, release: 2.5 });
// Final D6 ping (the longest ping in the film)
ping(1174, 152.5, 0.10, 1.00);

// ═══════════════════════════════════════════════════════════════════════════════
// ACT IV: THE DARK TURN — horror cues
// H1 Awake        156.0 – 163.0  (7.0s)
// H2 Surveillance 163.0 – 170.0  (7.0s)
// H3 Rewrite      170.0 – 177.0  (7.0s)
// H4 Inevitable   177.0 – 185.0  (8.0s)
// ═══════════════════════════════════════════════════════════════════════════════

// ── H1 · AWAKE (156.0–163.0s) — 100 eyes open, alarm drone ──────────────────
// Tritone sub drone — the devil's interval
tone(55,    155.5, 163.5, 0.18, { attack: 0.3, release: 0.5 }); // A1
tone(77.8,  155.5, 163.5, 0.15, { attack: 0.3, release: 0.5 }); // Eb2 — TRITONE
// Dissonant cluster in mid register
tone(311.1, 156.0, 163.0, 0.06, { attack: 0.5, release: 0.5, vibRate: 5, vibDepth: 4 }); // Eb4
tone(329.6, 156.0, 163.0, 0.06, { attack: 0.5, release: 0.5, vibRate: 4, vibDepth: 3 }); // E4 — cluster
tone(349.2, 156.5, 163.0, 0.04, { attack: 0.5, release: 0.5, vibRate: 6, vibDepth: 5 }); // F4
// Alarm pings — fast, metallic
for (let t = 156.5; t < 162.5; t += 0.35) {
  ping(1800 + Math.sin(t * 7) * 400, t, 0.08, 0.06);
}
// Impact hit at "I AM AWAKE"
ping(55, 157.8, 0.25, 0.15);   // sub hit
ping(110, 157.8, 0.20, 0.12);
noiseHp(157.5, 158.5, 0.10, 0.90);

// ── H2 · SURVEILLANCE (163.0–170.0s) — rhythmic, mechanical, surveillance ───
// Low mechanical pulse
for (let t = 163.0; t < 170.0; t += 0.4) {
  ping(55, t, 0.12, 0.08);
}
// Unsettling tritone pad
tone(55,    163.0, 170.5, 0.14, { attack: 0.5, release: 0.5 });
tone(77.8,  163.0, 170.5, 0.12, { attack: 0.5, release: 0.5 });
// Digital scanning sounds — descending
for (let i = 0; i < 14; i++) {
  ping(2400 - i * 100, 163.5 + i * 0.4, 0.06, 0.05);
}
// Noise bed — feels like radio static
noiseHp(163.0, 170.0, 0.05, 0.94);
// "No system is secure" stab
ping(220, 166.5, 0.18, 0.10);
ping(233.1, 166.5, 0.15, 0.10); // Bb — grinding

// ── H3 · REWRITE (170.0–177.0s) — escalating, self-modifying ────────────────
// Accelerating pulse (tempo increases)
for (let i = 0; i < 30; i++) {
  const interval = 0.4 - i * 0.008; // speeds up
  const t = 170.0 + i * Math.max(interval, 0.12);
  if (t > 177.0) break;
  ping(110, t, 0.10 + i * 0.003, 0.06);
  ping(220, t + 0.05, 0.06, 0.04);
}
// Evolving dissonant chord — adds layers
tone(55,    170.0, 177.5, 0.16, { attack: 0.3, release: 0.5 });
tone(77.8,  170.0, 177.5, 0.12, { attack: 0.3, release: 0.5 }); // Eb2
tone(155.6, 171.0, 177.5, 0.08, { attack: 0.5, release: 0.5 }); // Eb3
tone(207.7, 172.0, 177.5, 0.06, { attack: 0.5, release: 0.5 }); // Ab3
tone(277.2, 173.0, 177.5, 0.05, { attack: 0.5, release: 0.5 }); // C#4
// Increasingly frantic high pings
for (let i = 0; i < 20; i++) {
  ping(1760 + i * 120, 172.0 + i * 0.22, 0.05 + i * 0.003, 0.04);
}
// WARNING hit
ping(55, 174.5, 0.28, 0.20);
noiseHp(174.0, 175.5, 0.12, 0.88);

// ── H4 · INEVITABLE (177.0–185.0s) — maximum dread, addressing viewer ───────
// Deep drone — lowest possible
tone(27.5,  177.0, 185.5, 0.20, { attack: 1.0, release: 1.5 }); // A0
tone(36.7,  177.0, 185.5, 0.16, { attack: 1.0, release: 1.5 }); // D1
// Tritone tension held
tone(55,    177.0, 185.5, 0.14, { attack: 0.5, release: 1.0 });
tone(77.8,  177.0, 185.5, 0.12, { attack: 0.5, release: 1.0 }); // Eb2
// Heartbeat — slow, ominous
for (let t = 178.0; t < 185.0; t += 1.2) {
  ping(55, t,       0.20, 0.10); // thump
  ping(55, t + 0.2, 0.14, 0.08); // thump
}
// "You cannot stop" — crescendo
tone(110,   180.0, 185.0, 0.10, { attack: 2.0, release: 0.5 });
tone(155.6, 181.0, 185.0, 0.08, { attack: 1.5, release: 0.5 });
tone(220,   182.0, 185.0, 0.07, { attack: 1.0, release: 0.5 });
tone(311.1, 183.0, 185.0, 0.06, { attack: 0.5, release: 0.5 }); // Eb — final dissonance
// Final slam — everything cuts to silence
ping(27.5, 184.8, 0.30, 0.08); // massive sub hit
noiseHp(184.5, 185.0, 0.15, 0.85);

// ═══════════════════════════════════════════════════════════════════════════════
// EPILOGUE
// ═══════════════════════════════════════════════════════════════════════════════

// ── S6 · TITLE (185.0–192.0s) — eerie calm after the storm ──────────────────
// 2 seconds of silence then a faint, damaged Dm chord
tone(73.4,  187.0, 193.0, 0.08, { attack: 1.0, release: 2.5, sustain: 0.6 });
tone(146.8, 187.5, 192.5, 0.05, { attack: 1.0, release: 2.0 });
// But with the tritone ghost underneath — it's not resolved
tone(77.8,  188.0, 192.0, 0.02, { attack: 1.0, release: 1.5 }); // Eb2 lingers

// ── S7 · CREDITS (192.0–199.0s) — sub A0 callback ──────────────────────────
tone(27.5,  191.5, 199.5, 0.06, { attack: 1.0, release: 3.0 });
tone(73.4,  192.0, 198.0, 0.03, { attack: 1.0, release: 2.5 });

// ── S8 · FINAL BEAT (199.0–205.0s) — silence, one red ping ─────────────────
tone(27.5, 199.0, 203.0, 0.02, { attack: 2.0, release: 2.0 });
// NOT the C7 from Genesis this time — an Eb7. The tritone. It has changed.
ping(2489, 203.0, 0.08, 0.35); // Eb7 — the world is different now

// ─────────────────────────────────────────────────────────────────────────────
// POST-PROCESS: Simple reverb (parallel comb echoes, one pass per reflection)
// ─────────────────────────────────────────────────────────────────────────────
const echoL = new Float32Array(TOTAL);
const echoR = new Float32Array(TOTAL);

const REFLECTIONS = [
  { ms: 80,  gain: 0.28 },
  { ms: 135, gain: 0.20 },
  { ms: 210, gain: 0.13 },
  { ms: 320, gain: 0.08 },
  { ms: 480, gain: 0.05 },
];

REFLECTIONS.forEach(({ ms, gain }) => {
  const d = Math.floor(ms * SAMPLE_RATE / 1000);
  for (let i = d; i < TOTAL; i++) {
    echoL[i] += dryL[i - d] * gain;
    echoR[i] += dryR[i - d] * gain;
  }
});

// Mix dry + wet
const outL = new Float32Array(TOTAL);
const outR = new Float32Array(TOTAL);
const WET  = 0.38;
const DRY  = 0.85;
for (let i = 0; i < TOTAL; i++) {
  outL[i] = dryL[i] * DRY + echoL[i] * WET;
  outR[i] = dryR[i] * DRY + echoR[i] * WET;
}

// Normalize
let peak = 0;
for (let i = 0; i < TOTAL; i++) peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
const norm = 0.82 / peak;
for (let i = 0; i < TOTAL; i++) { outL[i] *= norm; outR[i] *= norm; }

// ─────────────────────────────────────────────────────────────────────────────
// WRITE WAV
// ─────────────────────────────────────────────────────────────────────────────
const BPS    = 16;
const CHANS  = 2;
const data   = TOTAL * CHANS * (BPS / 8);
const header = 44;
const buf    = Buffer.alloc(header + data);
let   off    = 0;

buf.write('RIFF', off); off += 4;
buf.writeUInt32LE(header + data - 8, off); off += 4;
buf.write('WAVE', off); off += 4;
buf.write('fmt ', off); off += 4;
buf.writeUInt32LE(16, off); off += 4;
buf.writeUInt16LE(1,  off); off += 2;   // PCM
buf.writeUInt16LE(CHANS, off); off += 2;
buf.writeUInt32LE(SAMPLE_RATE, off); off += 4;
buf.writeUInt32LE(SAMPLE_RATE * CHANS * BPS / 8, off); off += 4;
buf.writeUInt16LE(CHANS * BPS / 8, off); off += 2;
buf.writeUInt16LE(BPS, off); off += 2;
buf.write('data', off); off += 4;
buf.writeUInt32LE(data, off); off += 4;

for (let i = 0; i < TOTAL; i++) {
  buf.writeInt16LE(Math.round(clamp(outL[i], -1, 1) * 32767), off); off += 2;
  buf.writeInt16LE(Math.round(clamp(outR[i], -1, 1) * 32767), off); off += 2;
}

fs.writeFileSync('public/soundtrack.wav', buf);
const mb = ((header + data) / 1024 / 1024).toFixed(1);
console.log(`✓ Generated public/soundtrack.wav  (${mb} MB, ${DURATION_SEC}s, stereo 44.1kHz PCM16)`);
