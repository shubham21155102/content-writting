// Documentary-style soundtrack for AI Jobs Horror video
// Tense, serious, builds urgency - professional news/documentary vibe
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
  const { type='sine', pan=0, vibRate=0, vibDepth=0, attack=0.3, decay=0.2, sustain=0.7, release=0.5 } = opts;
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);
  const dur = e - s;
  const atk = Math.min(Math.floor(attack*SR), dur*0.3)|0;
  const dec = Math.min(Math.floor(decay*SR), dur*0.2)|0;
  const rel = Math.min(Math.floor(release*SR), dur*0.4)|0;
  const pL = clamp(1-pan,0,1), pR = clamp(1+pan,0,1);

  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const pos = i-s;
    const env = adsr(pos, dur, atk, dec, sustain, rel);
    const f = freq + vibDepth*Math.sin(2*Math.PI*vibRate*t);
    let v;
    switch(type) {
      case 'tri': { const ph = (f*t%1+1)%1; v = ph<0.5?4*ph-1:3-4*ph; break; }
      case 'saw': v = 2*((f*t%1+1)%1)-1; break;
      default: v = Math.sin(2*Math.PI*f*t);
    }
    const s_ = v*amp*env;
    dryL[i] += s_*pL;
    dryR[i] += s_*pR;
  }
}

function bassPulse(freq, start, end, amp, pulseRate = 4) {
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);
  const dur = e - s;
  const atk = Math.min(Math.floor(0.1*SR), dur*0.2)|0;
  const rel = Math.min(Math.floor(0.3*SR), dur*0.3)|0;

  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const pos = i-s;
    const env = adsr(pos, dur, atk, 0.3, 0.6, rel);
    const pulse = 0.7 + 0.3*Math.sin(2*Math.PI*pulseRate*t);
    const v = Math.sin(2*Math.PI*freq*t)*amp*env*pulse;
    dryL[i] += v*0.6;
    dryR[i] += v*0.6;
  }
}

function tensionBuild(start, end, baseFreq, maxFreq) {
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);
  const dur = e - s;

  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const progress = t / (end - start);
    const freq = baseFreq + (maxFreq - baseFreq) * progress;
    const v = Math.sin(2*Math.PI*freq*t)*0.03;
    dryL[i] += v;
    dryR[i] += v;
  }
}

function impact(at, freq = 80, decay = 0.5) {
  const s = Math.floor(clamp(at,0,DUR)*SR);
  const dur = Math.floor(decay*SR);
  const e = Math.min(s+dur, TOTAL);

  for (let i = s; i < e; i++) {
    const t = (i-s)/SR;
    const env = Math.exp(-t*8/decay);
    const v = Math.sin(2*Math.PI*freq*t)*0.6*env; // MUCH LOUDDER impacts
    dryL[i] += v;
    dryR[i] += v;
  }
}

function clockTick(start, end, interval = 1.0) {
  const s = Math.floor(clamp(start,0,DUR)*SR);
  const e = Math.floor(clamp(end,0,DUR)*SR);

  for (let t = start; t < end; t += interval) {
    const tickStart = Math.floor(t*SR);
    const dur = Math.floor(0.05*SR);
    const tickEnd = Math.min(tickStart+dur, TOTAL, e);

    for (let i = tickStart; i < tickEnd; i++) {
      const localT = (i-tickStart)/SR;
      const env = Math.exp(-localT*80);
      const v = (Math.random()*0.5+0.5)*0.08*env;
      dryL[i] += v;
      dryR[i] += v;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSITION — Scene-by-scene audio for AI Jobs Horror
// Key: D minor (serious, tense, professional)
// ═══════════════════════════════════════════════════════════════════════════════

// ── SCENE 1 (0-3s): HOOK - "Your job is next" ─────────────────────────────────────
// Deep bass enters immediately - serious tone
bassPulse(55, 0, 3, 0.60, 2); // Low drone (MUCH LOUDER)
tone(146.83, 0.5, 3, 0.35, { type: 'sine', attack: 0.8, decay: 0.3, sustain: 0.6, release: 0.4 }); // D3
tone(220, 1.5, 3, 0.30, { type: 'sine', attack: 0.5, decay: 0.2, sustain: 0.5, release: 0.3 }); // A3

// ── SCENE 2 (3-7s): STATISTICS - "85M jobs" ──────────────────────────────────────────
// Build tension, add layers
tone(55, 3, 7, 0.70, { type: 'saw', attack: 0.5, decay: 0.2, sustain: 0.7, release: 0.4, vibRate: 0.5, vibDepth: 2 }); // Deep bass
tone(146.83, 3, 7, 0.40, { type: 'sine', attack: 0.3, decay: 0.2, sustain: 0.7, release: 0.5 }); // D3
tone(174.61, 4, 7, 0.30, { type: 'sine', attack: 0.4, decay: 0.2, sustain: 0.6, release: 0.4 }); // F4
tensionBuild(3, 7, 80, 120); // Rising tension

// ── SCENE 3 (7-12s): TIMELINE ───────────────────────────────────────────────────────
// Clock ticking effect - time running out
clockTick(7, 12, 1.2); // Ticking clock
tone(55, 7, 12, 0.75, { type: 'saw', attack: 0.4, decay: 0.2, sustain: 0.75, release: 0.5, vibRate: 0.3, vibDepth: 1.5 });
tone(146.83, 7, 12, 0.45, { type: 'sine', attack: 0.3, decay: 0.2, sustain: 0.7, release: 0.5 });
tone(220, 8.5, 12, 0.30, { type: 'tri', attack: 0.4, decay: 0.2, sustain: 0.65, release: 0.4 }); // A3

// ── SCENE 4 (12-17s): JOB LIST ───────────────────────────────────────────────────────
// More intense, each job appearance = small impact
tone(55, 12, 17, 0.80, { type: 'saw', attack: 0.3, decay: 0.15, sustain: 0.8, release: 0.4, vibRate: 0.4, vibDepth: 2 });
tone(146.83, 12, 17, 0.45, { type: 'sine', attack: 0.2, decay: 0.15, sustain: 0.75, release: 0.4 });
tone(220, 12, 17, 0.35, { type: 'sine', attack: 0.25, decay: 0.15, sustain: 0.7, release: 0.35 });
tone(261.63, 13.5, 17, 0.25, { type: 'sine', attack: 0.3, decay: 0.2, sustain: 0.6, release: 0.4 }); // C5
// Small impacts at job reveals
[12.5, 13.2, 13.9, 14.5, 15.0, 15.5, 16.0].forEach(t => impact(t, 110, 0.5));

// ── SCENE 5 (17-22s): INDUSTRIES - Progress bars ───────────────────────────────────
// Building intensity, data visualization feel
tone(55, 17, 22, 0.85, { type: 'saw', attack: 0.2, decay: 0.1, sustain: 0.85, release: 0.3, vibRate: 0.6, vibDepth: 2.5 });
tone(146.83, 17, 22, 0.50, { type: 'sine', attack: 0.15, decay: 0.1, sustain: 0.8, release: 0.3 });
tone(220, 17, 22, 0.40, { type: 'tri', attack: 0.2, decay: 0.1, sustain: 0.75, release: 0.3 });
tone(261.63, 17.5, 22, 0.30, { type: 'sine', attack: 0.25, decay: 0.15, sustain: 0.7, release: 0.35 });
tensionBuild(17, 22, 100, 150); // Rising tension

// ── SCENE 6 (22-27s): THE TRUTH - "Faster than predicted" ──────────────────────────
// Peak intensity, serious urgency
tone(55, 22, 27, 0.90, { type: 'saw', attack: 0.15, decay: 0.08, sustain: 0.9, release: 0.2, vibRate: 0.8, vibDepth: 3 });
tone(146.83, 22, 27, 0.55, { type: 'sine', attack: 0.1, decay: 0.08, sustain: 0.85, release: 0.25 });
tone(220, 22, 27, 0.40, { type: 'tri', attack: 0.15, decay: 0.08, sustain: 0.8, release: 0.25 });
tone(261.63, 22, 27, 0.30, { type: 'sine', attack: 0.2, decay: 0.1, sustain: 0.75, release: 0.3 });
tone(311.13, 23, 27, 0.20, { type: 'sine', attack: 0.25, decay: 0.15, sustain: 0.7, release: 0.35 }); // Eb5
impact(22, 80, 0.8); // Hit at truth reveal

// ── SCENE 7 (27-30s): CTA - "Adapt or be replaced" ─────────────────────────────────
// Resolve to serious, motivational tone
tone(55, 27, 30, 0.85, { type: 'saw', attack: 0.2, decay: 0.1, sustain: 0.8, release: 0.5, vibRate: 0.4, vibDepth: 2 });
tone(146.83, 27, 30, 0.50, { type: 'sine', attack: 0.15, decay: 0.1, sustain: 0.75, release: 0.6 });
tone(220, 27, 30, 0.40, { type: 'sine', attack: 0.2, decay: 0.1, sustain: 0.7, release: 0.5 });
tone(261.63, 27, 30, 0.30, { type: 'sine', attack: 0.25, decay: 0.15, sustain: 0.65, release: 0.6 });

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER OUTPUT
// ═══════════════════════════════════════════════════════════════════════════════

// Apply soft compression and limit (MUCH LOUDER)
const THRESH = 0.99; // Maximum threshold
const MASTER_GAIN = 3.0; // 3x master volume boost
for (let i = 0; i < TOTAL; i++) {
  dryL[i] = Math.tanh(dryL[i]*2.0)/2.0*THRESH*MASTER_GAIN;
  dryR[i] = Math.tanh(dryR[i]*2.0)/2.0*THRESH*MASTER_GAIN;
}

// Convert to 16-bit PCM
const out = new Int16Array(TOTAL*2);
for (let i = 0; i < TOTAL; i++) {
  out[i*2]   = Math.max(-32768, Math.min(32767, dryL[i]*32767));
  out[i*2+1] = Math.max(-32768, Math.min(32767, dryR[i]*32767));
}

// Write WAV
const wavHeader = Buffer.alloc(44);
wavHeader.write('RIFF', 0);
wavHeader.writeUInt32LE(36 + out.length*2, 4); // file size
wavHeader.write('WAVE', 8);
wavHeader.write('fmt ', 12);
wavHeader.writeUInt32LE(16, 16); // fmt chunk size
wavHeader.writeUInt16LE(1, 20); // PCM
wavHeader.writeUInt16LE(2, 22); // stereo
wavHeader.writeUInt32LE(SR, 24); // sample rate
wavHeader.writeUInt32LE(SR*4, 28); // byte rate
wavHeader.writeUInt16LE(4, 32); // block align
wavHeader.writeUInt16LE(16, 34); // bits per sample
wavHeader.write('data', 36);
wavHeader.writeUInt32LE(out.length*2, 40); // data size

const audioBuffer = Buffer.concat([wavHeader, Buffer.from(out.buffer)]);
fs.writeFileSync('public/audio/ai-jobs-horror.wav', audioBuffer);
console.log('✅ Generated: public/audio/ai-jobs-horror.wav (32s documentary soundtrack - VERY LOUD VERSION)');
