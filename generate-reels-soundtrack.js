// Soundtrack for "I DIED. MY AI KEPT POSTING." — REELS version (88s)
'use strict';
const fs = require('fs');
const SR = 44100, DUR = 92, TOTAL = SR * DUR;
const dL = new Float32Array(TOTAL), dR = new Float32Array(TOTAL);
function clamp(x,a,b){return Math.max(a,Math.min(b,x))}
function adsr(p,d,a,dc,s,r){if(p<a)return p/a;if(p<a+dc)return 1-(1-s)*(p-a)/dc;if(p<d-r)return s;if(p<d)return s*(1-(p-(d-r))/r);return 0}
function tone(f,s,e,amp,o={}){const{type='sine',pan=0,vibRate=0,vibDepth=0,attack=0.4,decay=0.1,sustain=0.95,release=0.6}=o;const si=Math.floor(clamp(s,0,DUR)*SR),ei=Math.floor(clamp(e,0,DUR)*SR),dur=ei-si;const ak=Math.min(Math.floor(attack*SR),dur*0.3)|0,dc=Math.min(Math.floor(decay*SR),dur*0.1)|0,rl=Math.min(Math.floor(release*SR),dur*0.4)|0;const pL=clamp(1-pan,0,1),pR=clamp(1+pan,0,1);for(let i=si;i<ei;i++){const t=(i-si)/SR,p=i-si,env=adsr(p,dur,ak,dc,sustain,rl),fr=f+vibDepth*Math.sin(2*Math.PI*vibRate*t);let v;switch(type){case'tri':{const ph=(fr*t%1+1)%1;v=ph<0.5?4*ph-1:3-4*ph;break}default:v=Math.sin(2*Math.PI*fr*t)}const sv=v*amp*env;dL[i]+=sv*pL;dR[i]+=sv*pR}}
function ping(f,at,amp,dec=0.12){const s=Math.floor(clamp(at,0,DUR)*SR),dur=Math.floor(dec*SR),e=Math.min(s+dur,TOTAL);for(let i=s;i<e;i++){const t=(i-s)/SR,v=Math.sin(2*Math.PI*f*t)*amp*Math.exp(-t*18/dec);dL[i]+=v;dR[i]+=v}}
function notif(at,pan=0){const s=Math.floor(clamp(at,0,DUR)*SR),dur=Math.floor(0.07*SR),e=Math.min(s+dur,TOTAL);const pL=clamp(1-pan,0,1),pR=clamp(1+pan,0,1);for(let i=s;i<e;i++){const t=(i-s)/SR,v=Math.sin(2*Math.PI*(1200+t*800)*t)*0.05*Math.exp(-t*25);dL[i]+=v*pL;dR[i]+=v*pR}}
function noise(s,e,amp,hp=0.92){const si=Math.floor(clamp(s,0,DUR)*SR),ei=Math.floor(clamp(e,0,DUR)*SR),dur=ei-si;const ak=Math.min(Math.floor(0.2*SR),dur*0.2)|0,rl=Math.min(Math.floor(0.4*SR),dur*0.4)|0;let prev=0;for(let i=si;i<ei;i++){const p=i-si,env=adsr(p,dur,ak,1,0.8,rl),raw=Math.random()*2-1,v=raw-prev*hp;prev=v;dL[i]+=v*amp*env*0.4;dR[i]+=v*amp*env*0.4}}

// R01 HOOK (0-5s) — busy notifications
tone(55,0,5.5,0.10,{attack:0.8,release:0.6});
[0.2,0.6,0.9,1.3,1.6,2.0,2.3,2.6,2.8,3.0,3.2,3.4,3.5,3.6,3.7,3.8].forEach((t,i)=>notif(t,(i%3-1)*0.5));
tone(220,1,5,0.03,{attack:1.0,release:0.8,type:'tri'});

// R02 MIRROR (5-12s) — building unease
tone(55,4.5,12.5,0.12,{attack:0.5,release:0.7});
tone(164.8,5.5,12,0.04,{attack:1.0,release:0.7});
for(let t=6;t<11;t+=0.3)ping(3000+Math.sin(t*5)*400,t,0.015,0.03);
tone(220,8,11.5,0.03,{attack:1.5,release:0.5});

// R03 GLITCH (12-17s) — warmth then shock
tone(55,11.5,17.5,0.10,{attack:0.3,release:0.6});
tone(220,12,14.5,0.05,{attack:0.6,release:0.5,vibRate:0.5,vibDepth:0.5});
noise(13.8,14.3,0.12,0.88);ping(311.1,13.9,0.14,0.05);ping(329.6,13.9,0.12,0.05);
noise(14.1,14.5,0.08,0.90);
// blackout silence then flood
notif(15.0);notif(15.3);notif(15.5);notif(15.7);
for(let t=15.8;t<16.5;t+=0.1)notif(t,Math.random()*2-1);
tone(36.7,15.5,17,0.16,{attack:0.2,release:0.4});
ping(55,16.3,0.22,0.12);

// R04 NOBODY (17-25s) — ticking, unsettling normalcy
tone(55,16.5,25.5,0.10,{attack:0.5,release:0.8});
for(let t=17.5;t<24.5;t+=0.7)ping(4000,t,0.025,0.02);
[18,19.5,21.3,23,24.5].forEach(t=>{ping(55,t,0.10,0.08);ping(110,t+0.04,0.07,0.06)});
tone(220,20,25,0.035,{attack:1.5,release:0.8});
tone(261.6,22,25,0.025,{attack:1.0,release:0.7});

// R05 PERFECT (25-32s) — comparison unease
tone(55,24.5,32.5,0.10,{attack:0.4,release:0.7});
tone(82.4,25,32,0.05,{attack:0.6,release:0.6});
[26,27,28,29,30,31].forEach((t,i)=>ping(440+i*55,t,0.04,0.07));
tone(233.1,29,32,0.035,{attack:0.3,release:0.5,type:'tri'});

// R06 FRIEND (32-40s) — messages, warmth fading
tone(55,31.5,40.5,0.10,{attack:0.4,release:0.7});
[32.3,32.8,33.5,34.2,35,36.5,37,38,39,39.5].forEach((t,i)=>ping(i%2===0?1100:900,t,0.04,0.05));
tone(164.8,35,40,0.035,{attack:1.0,release:0.6});

// R07 REVEAL (40-48s) — knocking, discovery
tone(55,39.5,48.5,0.12,{attack:0.4,release:0.8});
[40.3,40.45,40.6].forEach(t=>{ping(120,t,0.16,0.04);ping(240,t,0.10,0.03)});
[41.5,41.65,41.8].forEach(t=>{ping(120,t,0.20,0.04);ping(200,t,0.12,0.03)});
tone(300,42.7,43.5,0.03,{attack:0.1,release:0.3,type:'tri'});
tone(440,43.5,47,0.025,{attack:0.4,release:0.5,vibRate:5,vibDepth:3});
noise(46.0,46.6,0.07,0.90);
ping(220,46.8,0.10,0.12);ping(261.6,46.8,0.08,0.12);ping(329.6,46.8,0.07,0.12);

// R08 ARCHIVE (48-58s) — stats then deleted messages (emotional core)
tone(55,47.5,58.5,0.10,{attack:0.4,release:0.8});
tone(110,48,58,0.06,{attack:0.5,release:0.7});
ping(440,48.2,0.07,0.10);ping(523.3,49.4,0.07,0.10);ping(587.3,50.5,0.07,0.10);
ping(659.3,51.7,0.08,0.12);
ping(293.7,52.8,0.12,0.25); // "67 times typed and deleted"
tone(220,52.5,55,0.04,{attack:0.2,release:1.0,vibRate:2,vibDepth:1.5});
// Deleted messages — typing sounds then sad dissolve tones
for(let t=53.3;t<54.1;t+=0.07)ping(6000,t,0.007,0.015);
ping(293.7,54.3,0.05,0.22);
for(let t=54.5;t<55.5;t+=0.07)ping(6000,t,0.007,0.015);
ping(277.2,55.7,0.05,0.22);
for(let t=55.8;t<56.8;t+=0.07)ping(6000,t,0.007,0.015);
ping(261.6,57.0,0.07,0.30);
for(let t=57.2;t<58.2;t+=0.07)ping(6000,t,0.007,0.015);
ping(220,58.4,0.09,0.45); // longest, saddest

// R09 QUESTION (58-68s) — the mirror, the truth
tone(55,57.5,68.5,0.10,{attack:0.4,release:0.8});
tone(110,58,68,0.06,{attack:0.4,release:0.6});
ping(55,58.2,0.14,0.10);ping(55,59.5,0.16,0.10);
tone(220,61.5,66,0.05,{attack:0.4,release:0.7});
tone(261.6,61.7,66,0.04,{attack:0.4,release:0.6});
tone(329.6,61.9,66,0.03,{attack:0.4,release:0.6});
for(let t=63.2;t<64.5;t+=0.06)ping(5500,t,0.008,0.02);
ping(293.7,64.8,0.10,0.28);
tone(220,64.8,67,0.04,{attack:0.2,release:0.8});

// R10 STATS (68-78s) — hammer stats, final question
tone(36.7,67.5,78.5,0.12,{attack:0.4,release:0.8});
ping(55,68.2,0.18,0.10);ping(110,68.2,0.14,0.08);
ping(55,70.0,0.18,0.10);ping(110,70.0,0.14,0.08);
ping(36.7,72.5,0.22,0.12);ping(55,72.5,0.18,0.10);noise(72.2,73.0,0.04,0.92);
tone(110,73.5,77,0.05,{attack:0.5,release:0.8});
ping(440,76.5,0.07,0.45);

// R11 FINAL (78-88s) — title, CTA
tone(55,77.5,86,0.05,{attack:0.8,release:2.0});
notif(78.0);
tone(36.7,81,88,0.07,{attack:0.3,release:2.5});
tone(55,81,88,0.05,{attack:0.3,release:2.5});

// POST-PROCESS: Reverb
const eL=new Float32Array(TOTAL),eR=new Float32Array(TOTAL);
[{ms:80,g:0.25},{ms:140,g:0.18},{ms:220,g:0.12},{ms:350,g:0.07}].forEach(({ms,g})=>{const d=Math.floor(ms*SR/1000);for(let i=d;i<TOTAL;i++){eL[i]+=dL[i-d]*g;eR[i]+=dR[i-d]*g}});
const oL=new Float32Array(TOTAL),oR=new Float32Array(TOTAL);
for(let i=0;i<TOTAL;i++){oL[i]=dL[i]*0.85+eL[i]*0.35;oR[i]=dR[i]*0.85+eR[i]*0.35}
let peak=0;for(let i=0;i<TOTAL;i++)peak=Math.max(peak,Math.abs(oL[i]),Math.abs(oR[i]));
const norm=0.82/peak;for(let i=0;i<TOTAL;i++){oL[i]*=norm;oR[i]*=norm}

// WRITE WAV
const BPS=16,CH=2,data=TOTAL*CH*(BPS/8),hdr=44,buf=Buffer.alloc(hdr+data);let off=0;
buf.write('RIFF',off);off+=4;buf.writeUInt32LE(hdr+data-8,off);off+=4;buf.write('WAVE',off);off+=4;
buf.write('fmt ',off);off+=4;buf.writeUInt32LE(16,off);off+=4;buf.writeUInt16LE(1,off);off+=2;
buf.writeUInt16LE(CH,off);off+=2;buf.writeUInt32LE(SR,off);off+=4;buf.writeUInt32LE(SR*CH*BPS/8,off);off+=4;
buf.writeUInt16LE(CH*BPS/8,off);off+=2;buf.writeUInt16LE(BPS,off);off+=2;
buf.write('data',off);off+=4;buf.writeUInt32LE(data,off);off+=4;
for(let i=0;i<TOTAL;i++){buf.writeInt16LE(Math.round(clamp(oL[i],-1,1)*32767),off);off+=2;buf.writeInt16LE(Math.round(clamp(oR[i],-1,1)*32767),off);off+=2}
fs.writeFileSync('public/reels-soundtrack.wav',buf);
console.log(`✓ Generated public/reels-soundtrack.wav (${((hdr+data)/1024/1024).toFixed(1)} MB, ${DUR}s)`);
