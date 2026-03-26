// Documentary-style soundtrack for AI Jobs Horror video
// Clean, professional, serious - like a news report or documentary
'use strict';
const fs = require('fs');

const SR   = 44100;
const DUR  = 32; // 30s + 2s tail
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

// Professional impact sound - clean bass thud
function impact(at, freq = 80, decay = 0.5) {
  const s = Math.floor(clamp(at,0,DUR)*SR);
  const dur = Math.floor(decay*SR);
  const e = Math.min(s+dur, TOTAL);
  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const env = Math.exp(-t*8/decay);
    const v = Math.sin(2*Math.PI*freq*t)*0.5*env;
    dryL[i] += v; dryR[i] += v;
  }
}

// News-style tick - clean, professional
function newsTick(start, end, interval = 1.0) {
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);
  for (let t = start; t < end; t += interval) {
    const tickStart = Math.floor(t*SR);
    const dur = Math.floor(0.03*SR);
    const tickEnd = Math.min(tickStart+dur, TOTAL, e);
    for (let i = tickStart; i < tickEnd; i++) {
      const localT = (i-tickStart)/SR;
      const env = Math.exp(-localT*120);
      const v = 0.06*env;
      dryL[i] += v; dryR[i] += v;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITION — Scene-by-scene audio for AI Jobs Horror
// Key: D minor (serious, tense, professional)
// ═══════════════════════════════════════════════════════════════════════════════

// ── SCENE 1 (0-3s): HOOK - "Your job is next" ─────────────────────────────────────
// Clean, serious intro
tone(73.4, 0, 3.5, 0.15, { attack: 0.8, release: 0.6 }); // D2 - serious bass
tone(110, 0.5, 3.5, 0.08, { attack: 0.6, release: 0.5 }); // A2
tone(146.8, 1.0, 3.5, 0.06, { attack: 0.5, release: 0.4 }); // D3
impact(2.8, 73.4, 0.4); // Subtle impact on "next"

// ── SCENE 2 (3-7s): STATISTICS - "85M jobs" ──────────────────────────────────────────
// Building tension, data reveal feel
tone(73.4, 3, 7.5, 0.18, { attack: 0.5, release: 0.6 });
tone(110, 3.5, 7.5, 0.10, { attack: 0.4, release: 0.5 });
tone(146.8, 3.5, 7.5, 0.07, { attack: 0.4, release: 0.4 });
tone(220, 4.5, 7.5, 0.05, { attack: 0.5, release: 0.4 }); // A3
impact(6.8, 73.4, 0.5); // Impact on stat reveal

// ── SCENE 3 (7-12s): TIMELINE ───────────────────────────────────────────────────────
// Clock-like progression - time running out
newsTick(7, 12, 1.2); // News-style ticking
tone(73.4, 7, 12.5, 0.20, { attack: 0.4, release: 0.5 });
tone(110, 7.5, 12.5, 0.12, { attack: 0.3, release: 0.4 });
tone(146.8, 7.5, 12.5, 0.08, { attack: 0.3, release: 0.4 });
tone(220, 9, 12.5, 0.06, { attack: 0.4, release: 0.3 }); // A3 enters
impact(11.8, 73.4, 0.6); // Impact at timeline end

// ── SCENE 4 (12-17s): JOB LIST ───────────────────────────────────────────────────────
// Clean list reveal - each job appears with subtle accent
tone(73.4, 12, 17.5, 0.22, { attack: 0.3, release: 0.5 });
tone(110, 12.5, 17.5, 0.14, { attack: 0.25, release: 0.4 });
tone(146.8, 12.5, 17.5, 0.10, { attack: 0.25, release: 0.35 });
tone(220, 12.5, 17.5, 0.07, { attack: 0.3, release: 0.3 });
// Subtle accents on job reveals
[12.8, 13.5, 14.2, 14.8, 15.3, 15.8, 16.3].forEach(t => ping(880, t, 0.03, 0.05));
impact(16.8, 73.4, 0.5);

// ── SCENE 5 (17-22s): INDUSTRIES - Progress bars ───────────────────────────────────
// Data visualization feel - clean progression
tone(73.4, 17, 22.5, 0.25, { attack: 0.25, release: 0.4 });
tone(110, 17.5, 22.5, 0.16, { attack: 0.2, release: 0.35 });
tone(146.8, 17.5, 22.5, 0.12, { attack: 0.2, release: 0.3 });
tone(220, 17.5, 22.5, 0.08, { attack: 0.25, release: 0.3 });
tone(293.7, 18.5, 22.5, 0.05, { attack: 0.3, release: 0.3 }); // D4
impact(21.8, 73.4, 0.6);

// ── SCENE 6 (22-27s): THE TRUTH - "Faster than predicted" ──────────────────────────
// Serious, impactful - the revelation
tone(73.4, 22, 27.5, 0.28, { attack: 0.2, release: 0.4 });
tone(110, 22.5, 27.5, 0.18, { attack: 0.15, release: 0.35 });
tone(146.8, 22.5, 27.5, 0.14, { attack: 0.15, release: 0.3 });
tone(220, 22.5, 27.5, 0.10, { attack: 0.2, release: 0.3 });
tone(293.7, 22.5, 27.5, 0.07, { attack: 0.2, release: 0.3 });
tone(349.2, 23.5, 27.5, 0.05, { attack: 0.25, release: 0.3 }); // F4
impact(22.2, 73.4, 0.8); // Big impact on truth reveal
impact(26.8, 73.4, 0.7); // Second impact

// ── SCENE 7 (27-30s): CTA - "Adapt or be replaced" ─────────────────────────────────
// Resolve to serious, motivational tone
tone(73.4, 27, 31, 0.25, { attack: 0.25, release: 0.8 });
tone(110, 27.5, 31, 0.16, { attack: 0.2, release: 0.7 });
tone(146.8, 27.5, 31, 0.12, { attack: 0.2, release: 0.6 });
tone(220, 27.5, 31, 0.08, { attack: 0.25, release: 0.6 });
tone(293.7, 27.5, 31, 0.06, { attack: 0.25, release: 0.6 });
impact(29.5, 73.4, 0.6); // Final impact

// ═══════════════════════════════════════════════════════════════════════════════
// POST-PROCESS: Reverb (clean documentary space)
// ═══════════════════════════════════════════════════════════════════════════════
const echoL = new Float32Array(TOTAL);
const echoR = new Float32Array(TOTAL);
[
  {ms:60,gain:0.20},
  {ms:120,gain:0.15},
  {ms:200,gain:0.10},
  {ms:320,gain:0.06}
].forEach(({ms,gain}) => {
  const d = Math.floor(ms*SR/1000);
  for (let i = d; i < TOTAL; i++) {
    echoL[i] += dryL[i-d]*gain;
    echoR[i] += dryR[i-d]*gain;
  }
});

const outL = new Float32Array(TOTAL), outR = new Float32Array(TOTAL);
for (let i = 0; i < TOTAL; i++) {
  outL[i] = dryL[i]*0.88 + echoL[i]*0.32;
  outR[i] = dryL[i]*0.88 + echoR[i]*0.32;
}

// Normalize to professional broadcast level (-14 LUFS target)
let peak = 0;
for (let i = 0; i < TOTAL; i++) {
  peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
}
const norm = 0.85/peak;
for (let i = 0; i < TOTAL; i++) {
  outL[i] *= norm;
  outR[i] *= norm;
}

// WRITE WAV
const BPS=16, CHANS=2, data=TOTAL*CHANS*(BPS/8), header=44;
const buf = Buffer.alloc(header+data);
let off=0;
buf.write('RIFF',off); off+=4;
buf.writeUInt32LE(header+data-8,off); off+=4;
buf.write('WAVE',off); off+=4;
buf.write('fmt ',off); off+=4;
buf.writeUInt32LE(16,off); off+=4;
buf.writeUInt16LE(1,off); off+=2;
buf.writeUInt16LE(CHANS,off); off+=2;
buf.writeUInt32LE(SR,off); off+=4;
buf.writeUInt32LE(SR*CHANS*BPS/8,off); off+=4;
buf.writeUInt16LE(CHANS*BPS/8,off); off+=2;
buf.writeUInt16LE(BPS,off); off+=2;
buf.write('data',off); off+=4;
buf.writeUInt32LE(data,off); off+=4;
for (let i = 0; i < TOTAL; i++) {
  buf.writeInt16LE(Math.round(clamp(outL[i],-1,1)*32767),off); off+=2;
  buf.writeInt16LE(Math.round(clamp(outR[i],-1,1)*32767),off); off+=2;
}
fs.writeFileSync('public/audio/ai-jobs-documentary.wav', buf);
console.log(`✅ Generated: public/audio/ai-jobs-documentary.wav (${((header+data)/1024/1024).toFixed(1)} MB, ${DUR}s)`);
console.log(`📊 Style: Documentary, clean, professional`);
console.log(`🎹 Key: D minor (serious, tense)`);
