// ETHICS.md og:video v4 — cyanotype photogram. Copy from briefs/ethics.md.md only.
const { el, add, onSeek, end, stage } = K;
const W = 1200, H = 630, BLUE = '#0F3D6E', DEEP = '#0A2A4F', WHITE = '#F4F7F9', OCHRE = '#E0A526';
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, t0, d) => cl((t - t0) / d);
const oc = (p) => 1 - Math.pow(1 - p, 3);
const io = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a, b, p) => a + (b - a) * p;
const wob = (t, t0, amp, f = 9, k = 3.2) => (t < t0 ? 0 : amp * Math.exp(-k * (t - t0)) * Math.sin(f * (t - t0)));
const mul = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const cv = add(stage, el('<canvas id="cv" width="1200" height="630"></canvas>')); const g = cv.getContext('2d');
const LYR = mk(), L = LYR.getContext('2d');

// sensitised paper: white sheet, emulsion brushed on by hand (ragged edges), mottled Prussian blue
function paper(seed) {
  const c = mk(), x = c.getContext('2d'), r = mul(seed);
  x.fillStyle = WHITE; x.fillRect(0, 0, W, H);
  const m = mk(), y = m.getContext('2d');
  y.fillStyle = '#000'; y.fillRect(22, 20, W - 44, H - 40);
  y.lineCap = 'round'; y.strokeStyle = '#000';
  for (let i = 0; i < 150; i++) { const yy = 14 + r() * (H - 28), left = r() < .5, len = 30 + r() * 150, x0 = left ? 8 + r() * 16 : W - 8 - r() * 16; y.lineWidth = 3 + r() * 10; y.globalAlpha = .5 + r() * .5; y.beginPath(); y.moveTo(x0, yy); y.lineTo(left ? x0 + len : x0 - len, yy + (r() - .5) * 6); y.stroke(); }
  for (let i = 0; i < 110; i++) { const xx = 14 + r() * (W - 28), top = r() < .5, y0 = top ? 8 + r() * 10 : H - 8 - r() * 10; y.lineWidth = 4 + r() * 12; y.globalAlpha = .5 + r() * .5; y.beginPath(); y.moveTo(xx, y0); y.lineTo(xx + 20 + r() * 120, y0 + (r() - .5) * 5); y.stroke(); }
  y.globalAlpha = 1; y.globalCompositeOperation = 'source-in';
  y.fillStyle = BLUE; y.fillRect(0, 0, W, H); y.globalCompositeOperation = 'source-atop';
  for (let i = 0; i < 70; i++) { const gx = r() * W, gy = r() * H, gr = 60 + r() * 220, gd = y.createRadialGradient(gx, gy, 0, gx, gy, gr); const dk = r() < .7; gd.addColorStop(0, dk ? 'rgba(10,42,79,.5)' : 'rgba(60,110,160,.16)'); gd.addColorStop(1, dk ? 'rgba(10,42,79,0)' : 'rgba(60,110,160,0)'); y.fillStyle = gd; y.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  for (let i = 0; i < 46; i++) { const yy = r() * H; y.globalAlpha = .05 + r() * .08; y.strokeStyle = r() < .5 ? DEEP : '#2A5C90'; y.lineWidth = 6 + r() * 26; y.beginPath(); y.moveTo(-10, yy); y.lineTo(W + 10, yy + (r() - .5) * 30); y.stroke(); }
  y.globalAlpha = 1; x.drawImage(m, 0, 0);
  const d = x.getImageData(0, 0, W, H); for (let i = 0; i < d.data.length; i += 4) { const v = (r() - .5) * 14; d.data[i] += v; d.data[i + 1] += v; d.data[i + 2] += v; } x.putImageData(d, 0, 0);
  return c;
}
const P1 = paper(4), P2 = paper(19), P3 = paper(33);

// eight different keys
const KEYS = [
  { bow: 0, len: 212, teeth: [[150, 16, 26], [176, 22, 20], [202, 10, 30]] }, { bow: 1, len: 190, teeth: [[140, 12, 22], [160, 26, 30]] },
  { bow: 2, len: 224, teeth: [[170, 30, 24], [206, 12, 16]] }, { bow: 3, len: 200, teeth: [[146, 10, 18], [162, 10, 28], [178, 18, 18]] },
  { bow: 4, len: 216, teeth: [[160, 40, 22]] }, { bow: 5, len: 184, teeth: [[132, 14, 28], [152, 14, 16], [170, 12, 24]] },
  { bow: 1, len: 230, teeth: [[176, 14, 20], [196, 30, 28]] }, { bow: 0, len: 196, teeth: [[150, 30, 18], [184, 10, 26]] }];
function keyShape(c, k) { // origin = the hole it hangs from; blade points down
  c.beginPath();
  const b = k.bow;
  if (b === 0) c.arc(0, 30, 36, 0, 7);
  else if (b === 1) c.ellipse(0, 28, 44, 31, 0, 0, 7);
  else if (b === 2) c.roundRect(-33, -4, 66, 66, 12);
  else if (b === 3) { c.arc(0, 14, 21, 0, 7); c.moveTo(1, 44); c.arc(-21, 44, 21, 0, 7); c.moveTo(43, 44); c.arc(21, 44, 21, 0, 7); }
  else if (b === 4) { for (let i = 0; i < 6; i++) { const a = i * 1.0472 + .5236; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 38, 30 + Math.sin(a) * 38); } c.closePath(); }
  else { c.moveTo(0, -12); c.lineTo(40, 30); c.lineTo(0, 72); c.lineTo(-40, 30); c.closePath(); }
  c.rect(-7, 56, 14, k.len - 56); c.rect(-13, 66, 26, 8); c.rect(-11, 79, 22, 5);
  k.teeth.forEach(([y, h, w]) => c.rect(6, y, w, h));
  c.fill();
  c.save(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, b === 5 ? 10 : 8, 7.5, 0, 7);
  if (b === 0) { c.moveTo(14, 36); c.arc(0, 36, 14, 0, 7); } if (b === 1) { c.moveTo(-10, 34); c.arc(-20, 34, 9, 0, 7); c.moveTo(30, 34); c.arc(20, 34, 9, 0, 7); } if (b === 2) { c.rect(-16, 24, 32, 22); } if (b === 4) { c.moveTo(12, 38); c.arc(0, 38, 12, 0, 7); }
  c.fill(); c.restore();
}
function tagShape(c, k, w = 62, h = 90) { // hangs on a string from the key's hole
  const ty = k.len + 30;
  c.lineWidth = 2.2; c.strokeStyle = WHITE; c.beginPath(); c.moveTo(-3, 8); c.quadraticCurveTo(-34, k.len * .55, 0, ty + 12); c.stroke();
  c.globalAlpha = .9; c.beginPath(); c.moveTo(-w / 2 + 12, ty); c.lineTo(w / 2 - 12, ty); c.lineTo(w / 2, ty + 12); c.lineTo(w / 2, ty + h); c.lineTo(-w / 2, ty + h); c.lineTo(-w / 2, ty + 12); c.closePath(); c.fill(); c.globalAlpha = 1;
  c.save(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(0, ty + 12, 4.5, 0, 7); c.fill(); c.restore();
}
function hookShape(c) { c.lineWidth = 5; c.lineCap = 'round'; c.strokeStyle = WHITE; c.beginPath(); c.moveTo(0, -26); c.lineTo(0, -6); c.arc(0, 2, 8, -Math.PI / 2, Math.PI * .75); c.stroke(); }
// composite the silhouette layer with soft sun-print edges
function expose() { g.save(); g.filter = 'blur(10px)'; g.globalAlpha = .34; g.drawImage(LYR, 0, 0); g.filter = 'blur(1.3px)'; g.globalAlpha = 1; g.drawImage(LYR, 0, 0); g.restore(); }
const SX = (i) => 132 + i * 133.7, HY = 112;
const LAND = [1.4, 1.22, 1.34, 1.5, 1.58, 1.76, 1.82, 1.98], FLIP = [2.16, 2.24, 2.36, 2.4, 2.54, 2.62, 2.66, 2.8];
function row(t, sc, hy, sx, giant) {
  L.clearRect(0, 0, W, H); L.fillStyle = WHITE;
  L.fillRect(sx(0) - 70 * sc, hy - 42 * sc, sx(7) - sx(0) + 140 * sc, 13 * sc);
  const tags = [];
  KEYS.forEach((k, i) => {
    L.save(); L.translate(sx(i), hy); L.scale(sc, sc); hookShape(L); L.restore();
    let x = sx(i), y = hy, rot = 0, s = sc, tagOn = true, trot = 0;
    if (giant) {
      if (i === 0) { const p = io(pr(t, .82, .58)); x = lerp(150, x, p); y = lerp(112 - t * 8, y, p); rot = lerp(-1.14 + t * .03, 0, p) + wob(t, 1.4, .2); s = Math.exp(lerp(Math.log(5), 0, p)); tagOn = t >= 1.46; trot = wob(t, 1.46, .3, 8, 2.6); }
      else { const p = pr(t, LAND[i] - .2, .2); if (p <= 0) return; y = lerp(-320, y, p * p); rot = wob(t, LAND[i], .3 * (i % 2 ? 1 : -1), 9 + i * .3, 2.8); trot = wob(t, LAND[i] + .05, .42 * (i % 2 ? 1 : -1), 7.5, 2.4); }
    }
    L.save(); L.translate(x, y); L.rotate(rot); L.scale(s, s); L.fillStyle = WHITE; keyShape(L, k);
    if (tagOn) { L.rotate(trot - rot * .5); const fl = giant ? Math.floor(pr(t, FLIP[i], .16) * 4) / 4 : 1; const sxk = Math.abs(Math.cos(fl * Math.PI)) || .04;
      L.save(); L.scale(sxk, 1); L.fillStyle = WHITE; tagShape(L, k); L.restore();
      if (fl > .5) tags.push({ m: L.getTransform(), sxk, k, i }); }
    L.restore();
  });
  return tags;
}
function tagText(tags) { tags.forEach(({ m, sxk, k, i }) => { g.save(); g.setTransform(m); g.scale(sxk, 1); g.fillStyle = BLUE; g.font = '700 31px ZS'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('E' + (i + 1), 0, k.len + 30 + 54); g.restore(); }); }
const develop = (a) => { if (a > 0) { g.save(); g.globalAlpha = a; g.fillStyle = '#DDE8E6'; g.fillRect(0, 0, W, H); g.restore(); } };

// ---- type + grease pencil (DOM/SVG, above the print)
const T = (cls, html, style) => add(stage, el(`<div class="t ${cls}" style="${style}">${html}</div>`));
const st1 = T('mono', 'Status: initial draft, version 0.1.0.', 'left:64px;top:556px');
const h1 = T('h', 'E1. Use access for its<br>authorized purpose', 'left:500px;top:186px');
const q1 = T('qt', 'Access to a source is not permission<br>for every use of it.', 'left:500px;top:356px');
const st2 = T('mono', 'Status: initial draft, version 0.1.0.', 'right:64px;top:556px');
const ttl = T('ttl', 'ETHICS.md', 'left:68px;top:404px');
const st3 = T('mono', 'Status: initial draft, version 0.1.0.', 'left:70px;top:536px');
const prom = T('prom', 'Practical boundaries for an AI assistant entrusted with people\'s information and actions.', 'left:622px;top:386px');
const gr = T('mono', 'This file grants no permissions.', 'left:622px;top:512px');
const by = T('mono', 'Built by Sunny Patneedi', 'left:622px;top:552px');
const svg = add(stage, el('<svg class="ink" width="1200" height="630" viewBox="0 0 1200 630"></svg>'));
const R = mul(8);
const ink = (pts, w, op = 1) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')); p.setAttribute('pathLength', 1); p.setAttribute('stroke-width', w); p.setAttribute('stroke-dasharray', '1 1'); p.setAttribute('stroke-dashoffset', 1); p.setAttribute('opacity', op); svg.appendChild(p); return p; };
const wl = (x0, y0, x1, y1, a, n = 10) => Array.from({ length: n + 1 }, (_, i) => [lerp(x0, x1, i / n), lerp(y0, y1, i / n) + (i && i < n ? (R() - .5) * a : 0)]);
const draw = (ps, p, on) => ps.forEach((q, i) => { const pp = cl(p * 1.15 - i * .08); q.setAttribute('stroke-dashoffset', (1 - pp).toFixed(4)); q.style.visibility = on && pp > 0 ? 'visible' : 'hidden'; });
const u1 = [ink(wl(498, 314, 936, 306, 5), 8, .95), ink(wl(940, 316, 520, 324, 5), 5, .8), ink(wl(504, 308, 930, 300, 4), 2.5, .7)];
const u2 = [ink(Array.from({ length: 34 }, (_, i) => { const a = -2.6 + i / 30 * 6.283; return [290 + Math.cos(a) * (236 + i * .5) + (R() - .5) * 3, 548 + Math.sin(a) * (24 + i * .12) + (R() - .5) * 2]; }), 5.5, .95), ink(wl(80, 580, 480, 576, 3), 3, .7)];
const vis = (n, on) => (n.style.visibility = on ? 'visible' : 'hidden');

onSeek.push((t) => {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none';
  if (t < 3) {
    g.drawImage(P1, 0, 0); develop(lerp(.5, 0, oc(pr(t, 0, 1.1))));
    const tags = row(t, 1, HY, SX, true); expose(); tagText(tags);
  } else if (t < 6) {
    g.drawImage(P2, 0, 0); develop(lerp(.5, 0, oc(pr(t, 3, .4))));
    L.clearRect(0, 0, W, H); L.fillStyle = WHITE;
    const sw = wob(t, 3, .09, 7, 1.6), k = KEYS[0];
    L.fillRect(40, 26, 520, 30);
    L.save(); L.translate(214, 96); L.scale(2.5, 2.5); hookShape(L); L.rotate(sw); keyShape(L, k); L.restore();
    // the tag, turned to camera
    const tx = 452, ty = 132, tw = 640, th = 370, ts = 1 + (1 - oc(pr(t, 3, .16))) * .07;
    L.save(); L.translate(tx + tw / 2, ty + th / 2); L.scale(ts, ts); L.translate(-tw / 2, -th / 2);
    L.globalAlpha = .93; L.beginPath(); L.moveTo(44, 0); L.lineTo(tw, 0); L.lineTo(tw, th); L.lineTo(44, th); L.lineTo(0, th - 44); L.lineTo(0, 44); L.closePath(); L.fill(); L.globalAlpha = 1;
    L.globalCompositeOperation = 'destination-out'; L.beginPath(); L.arc(26, th / 2, 11, 0, 7); L.fill(); L.globalCompositeOperation = 'source-over'; L.restore();
    L.lineWidth = 4; L.strokeStyle = WHITE; L.beginPath(); L.moveTo(214 + Math.sin(-sw) * 20, 118); L.bezierCurveTo(120, 330, 330, 420, tx + 26, ty + th / 2); L.stroke();
    expose();
  } else {
    g.drawImage(P3, 0, 0); develop(lerp(.5, 0, oc(pr(t, 6, .4))));
    const tags = row(t, .66, 96, (i) => 150 + i * 128.5, false);
    // drawing border + title block
    L.strokeStyle = WHITE; L.lineWidth = 3; L.strokeRect(46, 44, W - 92, H - 88);
    const lp = Math.floor(pr(t, 6.04, .24) * 6) / 6; L.lineWidth = 2.5; L.beginPath();
    L.moveTo(46, 372); L.lineTo(46 + (W - 92) * lp, 372); L.moveTo(600, 372); L.lineTo(600, 372 + 214 * lp); L.moveTo(600, 500); L.lineTo(600 + 554 * lp, 500); L.moveTo(600, 542); L.lineTo(600 + 554 * lp, 542); L.stroke();
    expose(); tagText(tags);
  }
  vis(st1, t >= 2.4 && t < 3);
  vis(h1, t >= 3.14 && t < 6); vis(q1, t >= 3.6 && t < 6); vis(st2, t >= 3.14 && t < 6);
  draw(u1, pr(t, 4.3, .3), t < 6);
  vis(ttl, t >= 6.2); vis(st3, t >= 6.52); vis(prom, t >= 6.36); vis(gr, t >= 6.52); vis(by, t >= 6.62);
  draw(u2, pr(t, 6.72, .26), true);
});
end();
