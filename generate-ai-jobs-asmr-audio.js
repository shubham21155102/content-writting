#!/usr/bin/env node
/**
 * AI JOBS HORROR - ASMR SOUNDTRACK
 * Soft, satisfying sounds for relaxing/tingly experience
 *
 * ASMR Elements:
 * - Soft keyboard typing sounds
 * - Electronic hums & processor sounds
 * - Gentle notification pings
 * - Data transmission sounds
 * - Whisper-quiet ambient tones
 */

const fs = require("fs");
const SR = 44100;
const TOTAL = 30 * SR; // 30 seconds

// Stereo buffer
const L = new Float32Array(TOTAL);
const R = new Float32Array(TOTAL);

// Helper: soft sine tone
function tone(freq, start, dur, vol = 0.3) {
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR;
    const phase = (t * freq * 2 * Math.PI) % (2 * Math.PI);
    const env = Math.sin((i / (dur * SR)) * Math.PI); // Smooth envelope
    L[Math.floor(start * SR) + i] += Math.sin(phase) * vol * env * 0.3;
    R[Math.floor(start * SR) + i] += Math.sin(phase) * vol * env * 0.3;
  }
}

// ASMR keyboard typing sounds - soft & satisfying
function typingSound(start, count = 5) {
  for (let k = 0; k < count; k++) {
    const t = start + k * 0.4;
    const pos = Math.floor(t * SR);

    // Soft plastic key press
    for (let i = 0; i < 2000; i++) {
      const env = Math.exp(-i / 300);
      const noise = (Math.random() - 0.5) * 2;
      L[pos + i] += noise * env * 0.04;
      R[pos + i] += noise * env * 0.04;
    }

    // Subtle bottom-out click
    for (let i = 0; i < 500; i++) {
      const env = Math.exp(-i / 80);
      L[pos + i + 500] += (Math.random() - 0.5) * env * 0.06;
      R[pos + i + 500] += (Math.random() - 0.5) * env * 0.06;
    }
  }
}

// Soft electronic hum - like a quiet server room
function softHum(start, dur, freq = 120) {
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 2) * Math.min(1, ((dur * SR - i) / SR) / 2);
    const phase = (t * freq * 2 * Math.PI) % (2 * Math.PI);
    const harmonic1 = Math.sin(phase * 2);
    const harmonic2 = Math.sin(phase * 3.5);
    L[Math.floor(start * SR) + i] += (Math.sin(phase) + harmonic1 * 0.3 + harmonic2 * 0.15) * 0.02 * env;
    R[Math.floor(start * SR) + i] += (Math.sin(phase) + harmonic1 * 0.3 + harmonic2 * 0.15) * 0.02 * env;
  }
}

// Gentle ping - satisfying notification sound
function gentlePing(start, freq = 880) {
  const pos = Math.floor(start * SR);
  for (let i = 0; i < 8000; i++) {
    const env = Math.exp(-i / 1500);
    const phase = (i / SR * freq * 2 * Math.PI);
    L[pos + i] += Math.sin(phase) * 0.08 * env;
    R[pos + i] += Math.sin(phase) * 0.08 * env;
  }
}

// Data transmission sparkle - soft crystalline sounds
function dataSparkle(start, count = 8) {
  for (let k = 0; k < count; k++) {
    const t = start + k * 0.3;
    const pos = Math.floor(t * SR);
    const freq = 1760 + Math.random() * 880;

    for (let i = 0; i < 3000; i++) {
      const env = Math.exp(-i / 500);
      const phase = (i / SR * freq * 2 * Math.PI);
      L[pos + i] += Math.sin(phase) * 0.03 * env;
      R[pos + i] += Math.sin(phase) * 0.03 * env;
    }
  }
}

// Processing chip sounds - soft crackling
function chipSounds(start, dur) {
  for (let i = 0; i < dur * SR; i += 100) {
    if (Math.random() < 0.03) {
      const pos = Math.floor(start * SR) + i;
      for (let j = 0; j < 200; j++) {
        const env = Math.exp(-j / 40);
        L[pos + j] += (Math.random() - 0.5) * 0.02 * env;
        R[pos + j] += (Math.random() - 0.5) * 0.02 * env;
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// BUILD THE ASMR SOUNDSCAPE
// ─────────────────────────────────────────────────────────────

console.log("🎧 Generating ASMR soundscape...");

// Scene 1: Soft keyboard typing + gentle ambient
tone(220, 0, 3, 0.15); // Soft A tone
typingSound(0.5, 8);
softHum(0, 4, 110);

// Scene 2: Data processing sounds + gentle pings
tone(220, 3, 4, 0.12);
dataSparkle(3.5, 10);
gentlePing(4, 880);
gentlePing(5.5, 1100);
chipSounds(3, 4);

// Scene 3: Typing + transmission sounds
tone(220, 7, 5, 0.1);
typingSound(7.5, 12);
dataSparkle(9, 12);
softHum(7, 5, 130);

// Scene 4: Processing + keyboard
tone(196, 12, 5, 0.12); // G tone
chipSounds(12, 5);
typingSound(13, 15);
gentlePing(14, 990);
gentlePing(16, 1320);

// Scene 5: Data flow sounds
tone(196, 17, 5, 0.1);
dataSparkle(17.5, 15);
softHum(17, 5, 140);
gentlePing(19, 880);
gentlePing(21, 1100);

// Scene 6: Processing + reveal
tone(175, 22, 5, 0.12); // F tone
chipSounds(22, 5);
dataSparkle(23, 10);
typingSound(24, 8);
gentlePing(25.5, 1320);

// Scene 7: Final processing + gentle fade
tone(165, 27, 3, 0.1); // E tone
softHum(27, 3, 150);
gentlePing(28, 880);
dataSparkle(28.5, 6);

// ─────────────────────────────────────────────────────────────
// POST-PROCESSING: Soft reverb for space
// ─────────────────────────────────────────────────────────────

const echoL = new Float32Array(TOTAL);
const echoR = new Float32Array(TOTAL);

// Soft, spacious reverb tail
[
  { ms: 80, gain: 0.25 },
  { ms: 160, gain: 0.18 },
  { ms: 280, gain: 0.12 },
  { ms: 440, gain: 0.06 },
].forEach(({ ms, gain }) => {
  const d = Math.floor((ms * SR) / 1000);
  for (let i = d; i < TOTAL; i++) {
    echoL[i] += L[i - d] * gain;
    echoR[i] += R[i - d] * gain;
  }
});

// Mix dry + wet
for (let i = 0; i < TOTAL; i++) {
  L[i] = (L[i] * 0.7 + echoL[i] * 0.3) * 0.6; // Master volume
  R[i] = (R[i] * 0.7 + echoR[i] * 0.3) * 0.6;
}

// ─────────────────────────────────────────────────────────────
// EXPORT AS WAV
// ─────────────────────────────────────────────────────────────

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

const buffer = new ArrayBuffer(44 + TOTAL * 6); // 16-bit stereo
const view = new DataView(buffer);

// WAV header
writeString(view, 0, "RIFF");
view.setUint32(4, 36 + TOTAL * 4, true);
writeString(view, 8, "WAVE");
writeString(view, 12, "fmt ");
view.setUint32(16, 16, true);
view.setUint16(20, 1, true); // PCM
view.setUint16(22, 2, true); // Stereo
view.setUint32(24, SR, true); // Sample rate
view.setUint32(28, SR * 4, true); // Byte rate
view.setUint16(32, 4, true); // Block align
view.setUint16(34, 16, true); // Bit depth
writeString(view, 36, "data");
view.setUint32(40, TOTAL * 4, true);

// Write samples (convert float to 16-bit PCM)
for (let i = 0; i < TOTAL; i++) {
  const l = Math.max(-1, Math.min(1, L[i]));
  const r = Math.max(-1, Math.min(1, R[i]));
  view.setInt16(44 + i * 4, l * 0x7FFF, true);
  view.setInt16(44 + i * 4 + 2, r * 0x7FFF, true);
}

fs.writeFileSync("public/audio/ai-jobs-asmr.wav", Buffer.from(buffer));
console.log("✅ ASMR audio saved: public/audio/ai-jobs-asmr.wav");
console.log("🎧 Duration: 30s | Sample rate: 44.1kHz | 16-bit stereo");
