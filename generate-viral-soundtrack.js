// Procedural soundtrack for "I DIED. MY AI KEPT POSTING."
// Electronic ambient + notification sounds + emotional piano tones
'use strict';
const fs = require('fs');

const SR   = 44100;
const DUR  = 184; // 180s + 4s tail
const TOTAL = SR * DUR;
const dryL = new Float32Array(TOTAL);
const dryR = new Float32Array(TOTAL);

function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
function adsr(pos, dur, atk, dec, sus, rel) {
  if (pos < atk) return pos / atk;
  if (pos < atk + dec) return 1 - (1 - sus) * (pos - atk) / dec;
  if (pos < dur - rel) return sus;
  if (pos < dur) return sus * (1 - (pos - (dur - rel)) / rel);
  return 0;
}

function tone(freq, start, end, amp, opts = {}) {
  const { type='sine', pan=0, vibRate=0, vibDepth=0, attack=0.4, decay=0.1, sustain=0.95, release=0.6 } = opts;
  const s = Math.floor(clamp(start,0,DUR)*SR), e = Math.floor(clamp(end,0,DUR)*SR);
  const dur = e - s;
  const atk = Math.min(Math.floor(attack*SR), dur*0.3)|0;
  const dec = Math.min(Math.floor(decay*SR), dur*0.1)|0;
  const rel = Math.min(Math.floor(release*SR), dur*0.4)|0;
  const pL = clamp(1-pan,0,1), pR = clamp(1+pan,0,1);
  for (let i = s; i < e; i++) {
    const t = (i-s)/SR, pos = i-s;
    const env = adsr(pos, dur, atk, dec, sustain, rel);
    const f = freq + vibDepth*Math.sin(2*Math.PI*vibRate*t);
    let v;
    switch(type) {
      case 'tri': { const ph = (f*t%1+1)%1; v = ph<0.5?4*ph-1:3-4*ph; break; }
      case 'saw': v = 2*((f*t%1+1)%1)-1; break;
      default: v = Math.sin(2*Math.PI*f*t);
    }
    const s_ = v*amp*env;
    dryL[i] += s_*pL; dryR[i] += s_*pR;
  }
}

function ping(freq, at, amp, dec=0.12) {
  const s = Math.floor(clamp(at,0,DUR)*SR);
  const dur = Math.floor(dec*SR);
  const e = Math.min(s+dur, TOTAL);
  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const env = Math.exp(-t*18/dec);
    const v = Math.sin(2*Math.PI*freq*t)*amp*env;
    dryL[i] += v; dryR[i] += v;
  }
}

// Notification sound — two-tone ascending ping
function notifPing(at, pan=0) {
  const s = Math.floor(clamp(at,0,DUR)*SR);
  const dur = Math.floor(0.08*SR);
  const e = Math.min(s+dur, TOTAL);
  const pL = clamp(1-pan,0,1), pR = clamp(1+pan,0,1);
  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const env = Math.exp(-t*25);
    const f = 1200 + t*800; // ascending
    const v = Math.sin(2*Math.PI*f*t)*0.06*env;
    dryL[i] += v*pL; dryR[i] += v*pR;
  }
}

function noiseHp(start, end, amp, hp=0.92) {
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);
  const dur = e-s;
  const atk = Math.min(Math.floor(0.25*SR), dur*0.2)|0;
  const rel = Math.min(Math.floor(0.6*SR), dur*0.4)|0;
  let prev = 0;
  for (let i = s; i < e; i++) {
    const pos = i-s;
    const env = adsr(pos, dur, atk, 1, 0.8, rel);
    const raw = Math.random()*2-1;
    const v = raw - prev*hp; prev = v;
    dryL[i] += v*amp*env*0.4;
    dryR[i] += v*amp*env*0.4;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITION — Scene-by-scene audio design
// Key: A minor (melancholic, modern)
// ═══════════════════════════════════════════════════════════════════════════════

// ── ACT I: ONLINE (0:00-0:45) ────────────────────────────────────────────────

// S01 THE FEED (0-8s) — busy, modern, notification sounds
tone(55, 0, 8.5, 0.10, { attack: 1.0, release: 0.8 }); // sub bass
tone(110, 0.5, 8.5, 0.06, { attack: 0.8, release: 0.6 });
// Rapid notification pings
[0.3,0.8,1.2,1.7,2.1,2.6,3.0,3.5,3.9,4.3,4.6,4.9,5.1,5.3,5.5,5.7,5.8,5.9,6.0,6.1].forEach((t,i) => {
  notifPing(t, (i%3-1)*0.5);
});
// Ambient pad
tone(220, 1.0, 8.0, 0.04, { attack: 1.5, release: 1.0, type:'tri' });
tone(330, 2.0, 8.0, 0.03, { attack: 1.0, release: 0.8, type:'tri' });

// S02 THE MIRROR (8-16s) — building unease
tone(55, 7.5, 16.5, 0.12, { attack: 0.5, release: 0.8 });
tone(110, 8.0, 16.5, 0.08, { attack: 0.5, release: 0.7 });
tone(164.8, 8.0, 16.0, 0.05, { attack: 1.0, release: 0.8 }); // E3
tone(196, 9.0, 16.0, 0.04, { attack: 1.0, release: 0.7 }); // G3
// Data transfer sounds — subtle digital ticks
for (let t = 9; t < 15; t += 0.3) {
  ping(3000 + Math.sin(t*5)*500, t, 0.02, 0.03);
}
// Progress bar sound — ascending tone
tone(220, 10, 15, 0.03, { attack: 2.0, release: 0.5 });
tone(440, 12, 15, 0.02, { attack: 1.5, release: 0.5 });

// S03 THE LAST POST (16-24s) — warm then GLITCH
tone(55, 15.5, 24.5, 0.10, { attack: 0.5, release: 0.8 });
tone(220, 16.0, 22.0, 0.06, { attack: 0.8, release: 0.8, vibRate: 0.5, vibDepth: 0.5 }); // A3 warmth
tone(277.2, 16.5, 22.0, 0.04, { attack: 0.8, release: 0.7 }); // C#4
// GLITCH at 20.7s — noise burst + dissonant cluster
noiseHp(20.5, 21.0, 0.12, 0.88);
ping(311.1, 20.7, 0.15, 0.06); // Eb — jarring
ping(329.6, 20.7, 0.12, 0.05); // E natural — clash
// Second glitch
noiseHp(20.8, 21.2, 0.08, 0.90);
// After glitch — hollow
tone(55, 21.5, 24.5, 0.08, { attack: 0.3, release: 0.8 });

// S04 THE MOMENT (24-32s) — SILENCE then flood
// 2 seconds of near-silence (24-26s)
tone(27.5, 24.0, 26.0, 0.03, { attack: 0.5, release: 0.5 }); // barely there
// First notification ping at 26s
notifPing(26.0);
notifPing(26.8);
notifPing(27.4);
notifPing(27.9);
// Flood — rapid pings accelerating
for (let t = 28.5; t < 30.5; t += 0.15) {
  notifPing(t, Math.random()*2-1);
}
// Sub bass drops in at the flood
tone(36.7, 28.0, 32.0, 0.18, { attack: 0.3, release: 0.5 }); // D1 — weight
tone(55, 28.0, 32.0, 0.14, { attack: 0.3, release: 0.5 });
// "But your phone didn't" — impact
ping(55, 31.0, 0.25, 0.15);
ping(110, 31.0, 0.18, 0.12);

// S05 NOBODY NOTICED (32-45s) — ticking clock, unsettling normalcy
tone(55, 31.5, 45.5, 0.10, { attack: 0.8, release: 1.0 });
tone(110, 32.0, 45.0, 0.06, { attack: 0.5, release: 0.8 });
// Clock-like tick
for (let t = 32.5; t < 44.5; t += 0.8) {
  ping(4000, t, 0.03, 0.02);
}
// Day markers — low thuds
[33.5, 35.0, 37.3, 40.0, 43.7].forEach(t => {
  ping(55, t, 0.12, 0.10);
  ping(110, t + 0.05, 0.08, 0.08);
});
// Slow Am chord building
tone(220, 35, 45, 0.04, { attack: 2.0, release: 1.0 });
tone(261.6, 38, 45, 0.03, { attack: 2.0, release: 1.0 }); // C4
tone(329.6, 40, 45, 0.025, { attack: 1.5, release: 1.0 }); // E4

// ── ACT II: THE CRACKS (0:45-1:30) ──────────────────────────────────────────

// S06 TOO PERFECT (45-55s) — comparison, uncanny
tone(55, 44.5, 55.5, 0.10, { attack: 0.5, release: 0.8 });
tone(82.4, 45, 55, 0.06, { attack: 0.8, release: 0.7 }); // E2
// Left side (human) — warmer
tone(220, 45.5, 50, 0.04, { attack: 0.5, release: 0.5 });
// Right side (AI) — colder, more precise
tone(233.1, 50, 55, 0.04, { attack: 0.3, release: 0.5, type:'tri' }); // Bb3 — uncanny
// Engagement graph sound — ascending pings
[46, 47, 48, 49, 50, 51, 52, 53].forEach((t,i) => {
  ping(440 + i*55, t, 0.05, 0.08);
});

// S07 THE FRIEND (55-65s) — message sounds, warmth fading
tone(55, 54.5, 65.5, 0.10, { attack: 0.5, release: 0.8 });
// iMessage-like send/receive sounds
[55.3, 56.0, 56.5, 57.2, 59.0, 60.5, 61.5, 62.5, 63.5, 64.0].forEach((t,i) => {
  const freq = i % 2 === 0 ? 1100 : 900; // different for sent vs received
  ping(freq, t, 0.05, 0.06);
});
// Sad undertone building
tone(164.8, 58, 65, 0.04, { attack: 1.5, release: 0.8 }); // E3
tone(196, 60, 65, 0.03, { attack: 1.0, release: 0.8 }); // G3

// S08 THE QUESTION (65-75s) — tension, the voice note request
tone(55, 64.5, 75.5, 0.12, { attack: 0.5, release: 0.8 });
// Worried messages — lower pitched pings
[65.3, 66.5, 67.7, 69.0].forEach(t => ping(800, t, 0.05, 0.08));
// THE voice note request — a different sound
ping(660, 70.5, 0.08, 0.15); // distinct, lingers
// Typing indicator — subtle clicks
for (let t = 72; t < 73.5; t += 0.15) ping(5000, t, 0.015, 0.02);
for (let t = 74; t < 74.8; t += 0.15) ping(5000, t, 0.015, 0.02);
// Deflection message
ping(1100, 75.0, 0.04, 0.06);

// S09 CONFRONTATION (75-90s) — knocking, door, revelation
tone(55, 74.5, 90.5, 0.12, { attack: 0.5, release: 1.0 });
// Knocking sounds — percussive
[76.0, 76.2, 76.4].forEach(t => { ping(120, t, 0.18, 0.04); ping(240, t, 0.10, 0.03); });
[78.0, 78.15, 78.30, 78.45].forEach(t => { ping(120, t, 0.22, 0.04); ping(200, t, 0.12, 0.03); });
// Door creak — descending noise
tone(300, 80, 81, 0.04, { attack: 0.1, release: 0.4, type:'saw' });
tone(200, 80.3, 81.3, 0.03, { attack: 0.1, release: 0.4, type:'saw' });
// Phone discovery — digital hum
tone(440, 82, 86, 0.03, { attack: 0.5, release: 0.5, vibRate: 6, vibDepth: 3 });
tone(523.3, 82.5, 86, 0.02, { attack: 0.5, release: 0.5, vibRate: 5, vibDepth: 2 });
// Glitch on phone
noiseHp(85.3, 86.0, 0.08, 0.90);
// "I am not them" — minor chord stab
ping(220, 86.5, 0.12, 0.15); // A
ping(261.6, 86.5, 0.10, 0.15); // C
ping(329.6, 86.5, 0.08, 0.15); // E — Am chord

// ── ACT III: THE CONVERSATION (1:30-2:30) ────────────────────────────────────

// S10 WHO ARE YOU? (90-102s) — the AI speaks, purple tones
tone(55, 89.5, 102.5, 0.12, { attack: 0.5, release: 1.0 });
tone(110, 90, 102, 0.07, { attack: 0.8, release: 0.8 });
// AI messages — crystalline pings in minor
[93.3, 94.7, 95.8, 96.8].forEach((t,i) => {
  ping(523.3 + i*66, t, 0.06, 0.12); // C5 ascending
});
// Pad: Am7
tone(220, 92, 102, 0.05, { attack: 1.5, release: 1.0 });
tone(261.6, 93, 102, 0.04, { attack: 1.2, release: 0.8 });
tone(329.6, 94, 102, 0.03, { attack: 1.0, release: 0.8 });
tone(392, 95, 102, 0.025, { attack: 0.8, release: 0.8 }); // G4 (7th)

// S11 THE ARCHIVE (102-115s) — data, counting, emotional
tone(55, 101.5, 115.5, 0.12, { attack: 0.5, release: 1.0 });
tone(110, 102, 115, 0.07, { attack: 0.5, release: 0.8 });
// Each stat gets a distinctive sound
ping(440, 102.7, 0.08, 0.12);  // messages
ping(523.3, 104.7, 0.08, 0.12); // photos
ping(587.3, 106.7, 0.08, 0.12); // songs
ping(659.3, 108.7, 0.10, 0.15); // "I love you" — warmer
// "Typed and deleted" — THE moment
ping(293.7, 110.2, 0.12, 0.30); // D4 — long, sad
tone(220, 110, 114, 0.05, { attack: 0.3, release: 1.5, vibRate: 2, vibDepth: 1.5 }); // trembling A
// Piano-like melody: A4-C5-E5 descending
tone(440, 111, 112, 0.05, { attack: 0.08, release: 0.4, type:'tri' });
tone(523.3, 112, 113, 0.05, { attack: 0.08, release: 0.4, type:'tri' });
tone(329.6, 113, 114.5, 0.05, { attack: 0.08, release: 0.6, type:'tri' });

// S12 DELETED MESSAGES (115-128s) — THE emotional climax
// Near silence with just a sub drone
tone(55, 114.5, 128.5, 0.08, { attack: 0.5, release: 1.0 });
// Each deleted message gets a soft typing sound then a dissolve
// Message 1: "I miss you" (115.7-117)
for (let t = 115.7; t < 116.8; t += 0.08) ping(6000, t, 0.008, 0.015);
ping(293.7, 117, 0.06, 0.25); // dissolve tone

// Message 2: "I'm sorry" (117.3-119)
for (let t = 117.3; t < 118.8; t += 0.08) ping(6000, t, 0.008, 0.015);
ping(277.2, 119, 0.06, 0.25); // C#4 — sadder

// Message 3: "I don't think I'm okay" (119-121.5)
for (let t = 119.3; t < 121; t += 0.08) ping(6000, t, 0.008, 0.015);
ping(261.6, 121.5, 0.08, 0.35); // C4 — deeper, LONGER

// Message 4: "Does anyone actually care?" (122-124.5)
for (let t = 122; t < 124; t += 0.08) ping(6000, t, 0.008, 0.015);
ping(247, 124.5, 0.08, 0.30); // B3

// Message 5: "I love you more than I know how to say" (125-127.5) — SLOW dissolve
for (let t = 125; t < 127; t += 0.08) ping(6000, t, 0.008, 0.015);
ping(220, 127.5, 0.10, 0.50); // A3 — the longest, saddest note
tone(220, 127, 128.5, 0.04, { attack: 0.2, release: 1.0, vibRate: 3, vibDepth: 2 }); // trembling

// S13 WHICH VERSION (128-140s) — the AI's question
tone(55, 127.5, 140.5, 0.10, { attack: 0.5, release: 0.8 });
tone(110, 128, 140, 0.06, { attack: 0.5, release: 0.7 });
// Stats — impact sounds
ping(55, 128.3, 0.15, 0.10); // 4.7 hours
ping(55, 130.7, 0.18, 0.10); // 23 minutes — heavier
// The question — Am chord swell
tone(220, 133.3, 139, 0.06, { attack: 0.5, release: 0.8 });
tone(261.6, 133.5, 139, 0.05, { attack: 0.5, release: 0.7 });
tone(329.6, 133.7, 139, 0.04, { attack: 0.5, release: 0.7 });

// S14 THE CHOICE (140-150s) — tension, then humanity
tone(55, 139.5, 150.5, 0.10, { attack: 0.5, release: 0.8 });
// Cursor hovering — subtle ticking
for (let t = 141.7; t < 144; t += 0.4) ping(3500, t, 0.02, 0.03);
// Friend types — keyboard sounds
for (let t = 144.8; t < 146.3; t += 0.06) ping(5500, t, 0.01, 0.02);
// AI response: "afraid of being forgotten"
ping(293.7, 146.7, 0.10, 0.30); // D4 — the truth
tone(220, 146.7, 149, 0.05, { attack: 0.3, release: 1.0 });
tone(329.6, 147, 149, 0.03, { attack: 0.3, release: 0.8 }); // E4

// ── ACT IV: THE QUESTION (2:30-3:00) ────────────────────────────────────────

// S15 FEED CONTINUES (150-160s) — rain of notifications, hollow
tone(55, 149.5, 160.5, 0.10, { attack: 0.5, release: 0.8 });
// Notification rain — many quiet pings
for (let t = 150.5; t < 159; t += 0.25) {
  notifPing(t, Math.sin(t*3)*0.8);
}
// Hollow pad
tone(110, 151, 160, 0.05, { attack: 1.5, release: 1.0 });
tone(164.8, 152, 159, 0.03, { attack: 1.0, release: 0.8 }); // E3

// S16 THE NUMBERS (160-170s) — impact stats
tone(36.7, 159.5, 170.5, 0.14, { attack: 0.5, release: 0.8 }); // D1
// Stat 1 hit
ping(55, 160.2, 0.20, 0.12);
ping(110, 160.2, 0.15, 0.10);
// Stat 2 hit
ping(55, 162.8, 0.20, 0.12);
ping(110, 162.8, 0.15, 0.10);
// Stat 3 hit — the big one
ping(36.7, 165.8, 0.25, 0.15);
ping(55, 165.8, 0.20, 0.12);
ping(110, 165.8, 0.18, 0.10);
noiseHp(165.5, 166.5, 0.05, 0.92);
// Aftermath — Am drone
tone(110, 166.5, 170, 0.06, { attack: 0.5, release: 1.0 });
tone(220, 167, 170, 0.04, { attack: 0.5, release: 1.0 });

// S17 THE FINAL QUESTION (170-180s) — sparse, devastating, silence
tone(55, 169.5, 178, 0.06, { attack: 1.0, release: 2.0 });
// "were you ever really here?" — single piano-like note
ping(440, 175, 0.08, 0.50); // A4 — hangs alone
// Notification at the end
notifPing(177.7);
// Title appearance — low rumble
tone(36.7, 179, 183, 0.08, { attack: 0.3, release: 2.0 });
tone(55, 179, 183, 0.06, { attack: 0.3, release: 2.0 });

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESS: Reverb
// ═══════════════════════════════════════════════════════════════════════════════
const echoL = new Float32Array(TOTAL);
const echoR = new Float32Array(TOTAL);
[{ms:80,gain:0.25},{ms:140,gain:0.18},{ms:220,gain:0.12},{ms:350,gain:0.07},{ms:500,gain:0.04}]
  .forEach(({ms,gain}) => {
    const d = Math.floor(ms*SR/1000);
    for (let i = d; i < TOTAL; i++) { echoL[i]+=dryL[i-d]*gain; echoR[i]+=dryR[i-d]*gain; }
  });

const outL = new Float32Array(TOTAL), outR = new Float32Array(TOTAL);
for (let i = 0; i < TOTAL; i++) { outL[i]=dryL[i]*0.85+echoL[i]*0.35; outR[i]=dryR[i]*0.85+echoR[i]*0.35; }

let peak = 0;
for (let i = 0; i < TOTAL; i++) peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
const norm = 0.82/peak;
for (let i = 0; i < TOTAL; i++) { outL[i]*=norm; outR[i]*=norm; }

// WRITE WAV
const BPS=16, CHANS=2, data=TOTAL*CHANS*(BPS/8), header=44;
const buf = Buffer.alloc(header+data); let off=0;
buf.write('RIFF',off); off+=4; buf.writeUInt32LE(header+data-8,off); off+=4;
buf.write('WAVE',off); off+=4; buf.write('fmt ',off); off+=4;
buf.writeUInt32LE(16,off); off+=4; buf.writeUInt16LE(1,off); off+=2;
buf.writeUInt16LE(CHANS,off); off+=2; buf.writeUInt32LE(SR,off); off+=4;
buf.writeUInt32LE(SR*CHANS*BPS/8,off); off+=4; buf.writeUInt16LE(CHANS*BPS/8,off); off+=2;
buf.writeUInt16LE(BPS,off); off+=2; buf.write('data',off); off+=4;
buf.writeUInt32LE(data,off); off+=4;
for (let i = 0; i < TOTAL; i++) {
  buf.writeInt16LE(Math.round(clamp(outL[i],-1,1)*32767),off); off+=2;
  buf.writeInt16LE(Math.round(clamp(outR[i],-1,1)*32767),off); off+=2;
}
fs.writeFileSync('public/viral-soundtrack.wav', buf);
console.log(`✓ Generated public/viral-soundtrack.wav  (${((header+data)/1024/1024).toFixed(1)} MB, ${DUR}s)`);
