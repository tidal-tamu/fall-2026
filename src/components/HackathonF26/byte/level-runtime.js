
/* =====================================================================
   SITE (everything after the hero) — one continuous game level
   ===================================================================== */
export function mountLevel(root, overlay) {
  let disposed = false, raf = 0;
  const events = new AbortController();
  const listen = (target, type, handler) => target.addEventListener(type, handler, { signal: events.signal });
  const $ = s => root.querySelector(s) || overlay.querySelector(s);
  const $$ = s => [...root.querySelectorAll(s), ...overlay.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const r1 = n => Math.round(n * 10) / 10;
  const INK = '#333f48', PENG = '#44515a';
  const HEART = 'M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z';

  /* ---------------- pixel art ---------------- */
  const PAL = { k: '#44515a', e: '#1f262c', w: '#fbfdff', c: '#f9e4cf', b: '#b4cadb', h: '#7fa7c4', g: '#cdd8cb',
    p: '#efd3b8', v: '#c6d8e2', s: '#dfe7ee', o: '#333f48', r: '#f3d2c4', n: '#9fb1be' };
  const SPR = {
    pebble: ['......kkkk......', '....kkkkkkkk....', '...kkkkkkkkkk...', '..kkkwwkkwwkkk..', '..kkwwwwwwwwkk..',
      '.kkwwewwwwewwkk.', '.kkwwwwccwwwwkk.', '.kkrwwwwwwwwrkk.', 'kkbbbbbbbbbbbbkk', 'kkkwwwwhhwwwwkkk',
      'kkkwwwwwwwwwwkkk', '.kkwwwwwwwwwwkk.', '.kkwwwwwwwwwwkk.', '..kkwwwwwwwwkk..', '...kkkkkkkkkk...', '...cc......cc...'],
    comic: ['................', '..kkkkkkkkkkk...', '..kbbbbbbbbbkk..', '..kbwwwwwwwbkk..', '..kbwppppwwbkk..', '..kbwppppppbkk..',
      '..kbwwppppwbkk..', '..kbwwwwwwwbkk..', '..kbkkkkkkkbkk..', '..kbwwwwwwwbkk..', '..kbkkkkkwwbkk..', '..kbwwwwwwwbkk..',
      '..kbbbbbbbbbkk..', '..kkkkkkkkkkkk..', '...kkkkkkkkkkk..', '................'],
    monster: ['................', '...w........w...', '...ww......ww...', '....gggggggg....', '...gggggggggg...', '..ggggwwwwgggg..',
      '..gggwwkkwwggg..', '..gggwwkkwwggg..', '..ggggwwwwgggg..', '..gggggggggggg..', '..grggggggggrg..', '..gggkwwwkgggg..',
      '..gggggkkggggg..', '..gggggggggggg..', '...gg......gg...', '................'],
    fish: ['................', '................', '................', '................', '....kkkkkk......', '...kbbbbbbk...kk',
      '..kbbwkbbbbk.kbk', '..kbbbbbbbbbkbbk', '..kbbbbbbbbbkbbk', '...kbbbbbbbk.kbk', '....kkkkkkk...kk', '................',
      '................', '................', '................', '................'],
    gameboy: ['...kkkkkkkkkk...', '...kssssssssk...', '...ksvvvvvvsk...', '...ksvvvvvvsk...', '...ksvvvvvvsk...', '...ksvvvvvvsk...',
      '...kssssssssk...', '...kskssssssk...', '...kkkkssppsk...', '...kskssssssk...', '...kssssssssk...', '...kssssskksk...',
      '...kkkkkkkkkk...', '................', '................', '................'],
    cloud: ['................', '................', '................', '......kkkk......', '.....kwwwwk.....', '..kkkwwwwwwkk...',
      '.kwwwwwwwwwwwk..', 'kwwwwwwwwwwwwwk.', 'kwwwwwwwwwwwwwk.', 'kvvvvvvvvvvvvvk.', '.kkkkkkkkkkkkk..', '................',
      '................', '................', '................', '................'],
    laptop: ['................', '................', '................', '................', '................', '................',
      '...kkkkkkkkkk...', '...kvvvvvvvvk...', '...kvvhhvvvvk...', '...kvvvvvhvvk...', '...kkkkkkkkkk...', '..kssssssssssk..',
      '..kkkkkkkkkkkk..', '................', '................', '................']
  };
  // generated sprites: heart, cd, clock, mic
  (() => {
    const hs = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...', '.......'];
    const g = Array.from({ length: 16 }, () => Array(16).fill('.'));
    hs.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === 'X') for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) g[1 + j * 2 + a][1 + i * 2 + b] = 'h'; }));
    g[3][4] = g[3][5] = g[4][4] = 'w';
    const o = g.map(r => r.slice());
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x] === '.' && [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => g[y + dy]?.[x + dx] && g[y + dy][x + dx] !== '.')) o[y][x] = 'k';
    SPR.heart = o.map(r => r.join(''));
    const iri = ['v', 'c', 'g', 'w', 'p', 'v'];
    SPR.cd = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => {
      const dx = x - 7.5, dy = y - 7.5, d = Math.hypot(dx, dy);
      if (d > 7.6) return '.'; if (d > 6.7) return 'k'; if (d < 1.3) return '.'; if (d < 2.3) return 'k';
      if (d < 3.4) return 's'; return iri[Math.floor(((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2)) * 6) % 6];
    }).join(''));
    SPR.clock = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => {
      const dx = x - 7.5, dy = y - 7.5, d = Math.hypot(dx, dy);
      if (d > 7.4) return '.'; if (d > 6.4) return 'k';
      if ((x === 7 || x === 8) && y >= 3 && y <= 8) return 'k';
      if ((y === 7 || y === 8) && x >= 8 && x <= 11) return 'k';
      if (d > 5.6 && (x === 7 || x === 8 || y === 7 || y === 8)) return 'n';
      return 'w';
    }).join(''));
    SPR.mic = ['.....', '.ppp.', 'ppppp', 'ppppp', '.ppp.', '..k..', '..k..', '..k..', '..k..', '..k..', '..k..', '.kkk.', 'kkkkk'];
  })();
  function sprite(ctx, rows, x, y, s = 1) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => {
      if (ch === '.') return; ctx.fillStyle = PAL[ch]; ctx.fillRect(x + i * s, y + j * s, s, s);
    }));
  }
  const COVERS = [['pebble', '#e3edf6'], ['comic', '#f9e4cf'], ['monster', '#e6eef4'], ['heart', '#fbfdff'],
    ['fish', '#f6ede2'], ['cd', '#dfe7ee'], ['gameboy', '#f9e4cf'], ['cloud', '#cfdde9']];
  function cover(canvas, i) {
    const ctx = canvas.getContext('2d'); const [name, bg] = COVERS[i % COVERS.length];
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 16, 16);
    for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 * 2; x < 16; x += 4) { ctx.fillStyle = 'rgba(51,63,72,.06)'; ctx.fillRect(x, y, 1, 1); }
    sprite(ctx, SPR[name], 0, 0, 1);
  }

  /* little GBA-cutscene rooms for pebble */
  function room(ctx, W, H, floorY) {
    ctx.fillStyle = '#e3edf6'; ctx.fillRect(0, 0, W, H);
    for (let y = 3; y < floorY - 4; y += 10) for (let x = (y % 20 ? 4 : 9); x < W; x += 14) {
      ctx.fillStyle = '#cfdde9'; ctx.fillRect(x, y + 1, 3, 1); ctx.fillRect(x + 1, y, 1, 3);
    }
    ctx.fillStyle = '#f9e4cf'; ctx.fillRect(0, floorY, W, H - floorY);
    ctx.fillStyle = '#efd3b8'; for (let x = 0; x < W; x += 8) ctx.fillRect(x, floorY + 4, 4, 1);
    ctx.fillStyle = '#b9cad7'; ctx.fillRect(0, floorY - 1, W, 1);
  }
  function desk(ctx, x0, x1, y0, y1) {
    ctx.fillStyle = PAL.k; ctx.fillRect(x0 + 2, y0 - 1, x1 - x0 - 4, 1);
    ctx.fillStyle = '#b4cadb'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); ctx.fillRect(x0 + 2, y0 - 1, x1 - x0 - 4, 1);
    ctx.fillStyle = PAL.k; ctx.fillRect(x0, y0, 1, y1 - y0); ctx.fillRect(x1 - 1, y0, 1, y1 - y0); ctx.fillRect(x0 + 1, y0 - 1, x1 - x0 - 2, 1);
    ctx.fillStyle = '#fbfdff'; for (let y = y0 + 3; y < y1; y += 5) for (let x = x0 + 4 + (y % 2) * 3; x < x1 - 3; x += 7) ctx.fillRect(x, y, 2, 2);
  }
  function aboutScene(canvas, kind, t) {
    const ctx = canvas.getContext('2d'), W = 96, H = 48, bob = Math.round((Math.sin(t * 5) + 1) / 2);
    room(ctx, W, H, 38);
    const px = kind === 'pebble' ? 38 : 30;
    sprite(ctx, SPR.pebble, px, 18 - bob, 1);
    if (kind === 'pebble') { sprite(ctx, SPR.fish.map(r => r), 52, 13 - bob, 1); sprite(ctx, SPR.mic, 66, 22, 1); }
    if (kind === 'tidal') sprite(ctx, SPR.laptop, 48, 21, 1);
    if (kind === 'byte') { sprite(ctx, SPR.clock, 52, 16, 1); sprite(ctx, SPR.heart, 68, 20 - bob, 1); }
    desk(ctx, 16, 80, 33, 48);
  }


  /* extra item sprites */
  SPR.gem = ['................', '................', '....kkkkkkkk....', '...kvwwvvvvbk...', '..kvwwvvvvvbbk..', '.kkkkkkkkkkkkkk.', '.kbvvwwvvvvbbhk.', '..kbvwwvvvbbhk..',
    '...kbvwvvbbhk...', '....kbvvbbhk....', '.....kbvbhk.....', '......kbhk......', '.......kk.......', '................', '................', '................'];
  (() => {
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 3.1 : 7.4; pts.push([7.5 + Math.cos(a) * r, 8.3 + Math.sin(a) * r]); }
    const inside = (x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
    const g = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => inside(x + .5, y + .5) ? 'c' : '.'));
    const o = g.map(r => r.slice());
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (g[y][x] === '.' && [[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => g[y + dy]?.[x + dx] === 'c')) o[y][x] = 'k';
    o[6][6] = o[7][6] = o[6][7] = 'w';
    SPR.star = o.map(r => r.join(''));
  })();

  /* ---------------- sky: stars + drifting clouds ---------------- */
  const sky = $('#sky');
  let stars = '';
  for (let i = 0; i < 52; i++) { const x = (i * 37.7) % 100, y = (i * 61.3) % 88, s = 2 + (i % 3);
    stars += `<i style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;width:${s}px;height:${s}px;animation-delay:-${(i % 7) * .6}s"></i>`; }
  sky.querySelector('.stars').innerHTML = stars;
  const CLOUD = `<svg viewBox="0 0 300 140"><path d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z" fill="#fbfdff"/>
    <path d="M38 120 C44 106 64 102 80 110 C94 96 122 96 134 108 C152 94 184 96 194 108 C212 98 242 100 256 116 L262 120 Z" fill="#e3edf6"/>
    <path d="M34 122 C10 122 8 94 32 92 C26 68 54 54 76 66 C82 36 118 24 142 42 C154 16 198 14 210 44 C232 32 264 46 260 72 C286 74 294 106 272 120 Z" fill="none" stroke="#4b5866" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
  sky.querySelector('.clouds2').innerHTML = [[9, 230, 190], [26, 170, 240], [52, 260, 210], [70, 150, 260]].map(([top, w, dur], i) =>
    `<div class="cl" style="top:${top}%;width:${Math.round(w * Math.max(.55, Math.min(1, innerWidth / 1200)))}px;opacity:.9;animation-duration:${dur}s;animation-delay:-${(i * dur / 3.3).toFixed(0)}s">${CLOUD}</div>`).join('');

  /* sky colours through the day — blended in OKLab so the sunset never bands */
  const toLin = c => (c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  const toSrgb = c => 255 * (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);
  function ok(hex) {
    const [r, g, b] = [1, 3, 5].map(i => toLin(parseInt(hex.slice(i, i + 2), 16)));
    const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .7936177850 * m - .0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .8086757660 * s];
  }
  function rgb([L, a, b]) {
    const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.2914855480 * b) ** 3;
    const R = 4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, G = -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, B = -.0041960863 * l - .7034186147 * m + 1.7076147010 * s;
    return `rgb(${[R, G, B].map(v => Math.round(clamp(toSrgb(Math.max(0, v)), 0, 255))).join(',')})`;
  }
  const SKY = [
    [0, '#e6eef4', '#f4f8fb'], [.2, '#dce9f3', '#f1f6fa'], [.4, '#e1e8f0', '#f7f0e6'], [.55, '#e3e1ea', '#f7e6d5'],
    [.66, '#dad5e3', '#f3d9c6'], [.76, '#c6c3d6', '#ecc9bb'], [.84, '#a5a9c0', '#dbb7b3'], [.91, '#727d96', '#a99aa8'],
    [.96, '#46536a', '#6c6f86'], [1, '#2b3640', '#414c5e']
  ].map(([p, a, b]) => [p, ok(a), ok(b)]);
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  function skyAt(p) {
    for (let i = 1; i < SKY.length; i++) if (p <= SKY[i][0]) { const [a, A1, A2] = SKY[i - 1], [b, B1, B2] = SKY[i], k = (p - a) / (b - a); return [mix(A1, B1, k), mix(A2, B2, k)]; }
    return [SKY[SKY.length - 1][1], SKY[SKY.length - 1][2]];
  }
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  /* ---------------- pebble, big, for player select ---------------- */
  const FISH = `<path d="M-9 7 Q0 3 9 7 L3 -8 L-3 -8 Z" fill="#c6d8e2" stroke="${PENG}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M0 -64 C12 -58 15 -38 11 -22 C9 -14 5 -9 2 -7 L-2 -7 C-5 -9 -9 -14 -11 -22 C-15 -38 -12 -58 0 -64 Z" fill="#c6d8e2" stroke="${PENG}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M-8 -41 Q0 -36 8 -41" fill="none" stroke="${PENG}" stroke-width="1.8" stroke-linecap="round"/><circle cx="0" cy="-50" r="5" fill="#fff" stroke="${PENG}" stroke-width="2.2"/><circle cx=".8" cy="-49.4" r="2.3" fill="${PENG}"/>`;
  const CAPE = 'M-42 -59 Q-72 -38 -78 2 Q-62 9 -46 4 Q-30 10 -14 4 Q2 10 18 4 Q32 9 44 3 Q52 -34 46 -60 Z';
  $('#bigPebble').innerHTML = `<svg viewBox="-86 -180 176 192">
    <defs><pattern id="bpDots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#93b5cc"/></pattern></defs>
    <g class="bp-cape"><path d="${CAPE}" fill="#b4cadb" stroke="${PENG}" stroke-width="2.6" stroke-linejoin="round"/><path d="${CAPE}" fill="url(#bpDots)"/>
      <path d="M-38 -50 Q-58 -30 -64 -2" fill="none" stroke="#f1f7fb" stroke-width="2.4" stroke-linecap="round"/></g>
    <ellipse cx="-14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/><ellipse cx="14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/>
    <path d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z" fill="${PENG}"/>
    <path d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z" fill="#fbfdff"/>
    <ellipse cx="-21" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/><ellipse cx="23" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/>
    <g class="bp-eyes"><ellipse cx="-13" cy="-80" rx="3.6" ry="3.4" fill="${PENG}"/><ellipse cx="15" cy="-80" rx="3.6" ry="3.4" fill="${PENG}"/></g>
    <ellipse cx="1" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke="${PENG}" stroke-width="2.6"/>
    <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill="${PENG}"/>
    <path d="M-42 -63 Q2 -51 47 -64 Q51 -60 47 -56 Q2 -43 -41 -55 Q-46 -59 -42 -63 Z" fill="#b4cadb" stroke="${PENG}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M-35 -59.5 Q2 -50 39 -60.5" fill="none" stroke="#f1f7fb" stroke-width="1.6" stroke-linecap="round"/>
    <path d="${HEART}" transform="translate(-2.2,-54.5) scale(1.15)" fill="#7fa7c4" stroke="${PENG}" stroke-width=".6" shape-rendering="crispEdges"/>
    <g transform="translate(58,-70) rotate(16)">${FISH}</g>
    <path d="M33 -50 C38 -68 58 -82 66 -72 C70 -62 56 -48 40 -40 Z" fill="${PENG}"/>
  </svg>`;

  /* ---------------- STAGE 1-1 ---------------- */
  const aboutSec = $('#about'), panels = $$('.panel'), aboutCanvases = $$('.pix[data-scene] canvas');
  const aboutButtons = $$('.about-controls button');
  aboutButtons.forEach(button => listen(button, 'click', () => {
    const index = Number(button.dataset.panel);
    panels.forEach((panel, i) => {
      panel.classList.toggle('on', i === index);
      panel.setAttribute('aria-hidden', String(i !== index));
    });
    aboutButtons.forEach((item, i) => item.setAttribute('aria-pressed', String(i === index)));
  }));
  const aboutIO = new IntersectionObserver(es => { if (es[0].isIntersecting) aboutSec.classList.add('seen'); }, { threshold: .15 });
  aboutIO.observe(aboutSec);

  /* ---------------- STAGE 1-2 · quest log ---------------- */
  const QUESTS = [
    ['8:00', 'check-in + breakfast', 'grab a name tag and a pastry', 'food', 'fish'],
    ['8:30', 'opening ceremony', '', 'main', 'mic'],
    ['9:00', 'hacking begins', 'the clock starts now', 'main', 'star', true],
    ['9:15', 'team-finding mixer', "solo? we'll match you", 'side', 'monster'],
    ['10:30', 'workshop: git without tears', '', 'side', 'comic'],
    ['12:30', 'lunch', '', 'food', 'fish'],
    ['14:00', 'workshop: ship a web app', '', 'side', 'laptop'],
    ['16:00', "pebble's snack break", 'cup-stacking tournament', 'side', 'heart'],
    ['17:00', 'mentor office hours', '', 'side', 'pebble'],
    ['18:30', 'dinner', '', 'food', 'fish'],
    ['21:00', 'hacking ends · submit', 'final boss: the deadline', 'boss', 'clock', true],
    ['21:15', 'demos + judging', '', 'main', 'gem'],
    ['22:15', 'awards + closing', '', 'main', 'star']
  ];
  const TAG = { main: 'MAIN', side: 'SIDE', food: 'FOOD', boss: 'BOSS' };
  const qlist = $('#qlist');
  qlist.innerHTML = QUESTS.map(([t, name, note, kind, , hi]) => `<li class="q${hi ? ' main' : ''}" tabindex="0">
    <span class="q-time">${t}</span><canvas width="16" height="16" aria-hidden="true"></canvas>
    <span class="q-name">${name}${note ? `<small>${note}</small>` : ''}</span><span class="tag ${kind}">${TAG[kind]}</span></li>`).join('');
  $('#qCount').textContent = QUESTS.length + ' QUESTS';
  const qRows = $$('.q');
  qRows.forEach((li, i) => { const c = li.querySelector('canvas').getContext('2d'); c.fillStyle = '#e3edf6'; c.fillRect(0, 0, 16, 16); sprite(c, SPR[QUESTS[i][4]], QUESTS[i][4] === 'mic' ? 5 : 0, QUESTS[i][4] === 'mic' ? 2 : 0, 1); });
  const qIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
    const i = qRows.indexOf(e.target); e.target.style.transitionDelay = (i % 4) * 70 + 'ms'; e.target.classList.add('in'); qIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  qRows.forEach(r => reduce ? r.classList.add('in') : qIO.observe(r));
  const giver = $('#giverCanvas'), gctx = giver.getContext('2d');
  function drawGiver(t) {
    const c = gctx, b = Math.round((Math.sin(t * 4) + 1) / 2);
    c.fillStyle = '#e3edf6'; c.fillRect(0, 0, 48, 48);
    for (let y = 4; y < 34; y += 10) for (let x = (y % 20 ? 4 : 9); x < 48; x += 14) { c.fillStyle = '#cfdde9'; c.fillRect(x, y + 1, 3, 1); c.fillRect(x + 1, y, 1, 3); }
    c.fillStyle = '#f9e4cf'; c.fillRect(0, 38, 48, 10); c.fillStyle = '#b9cad7'; c.fillRect(0, 37, 48, 1);
    sprite(c, SPR.pebble, 16, 22 - b, 1); sprite(c, SPR.comic, 30, 24 - b, 1);
  }

  /* save the quest log as a picture */
  async function questPNG() {
    try { await Promise.all(['20px "Press Start 2P"', '400 20px "Space Mono"', '700 20px "Space Mono"'].map(f => document.fonts.load(f))); } catch (e) {}
    const W = 1080, X0 = 80, WW = W - 160, P = 54, L = X0 + P, R = X0 + WW - P;
    const PS = n => `${n}px "Press Start 2P", monospace`, MONO = (n, b) => `${b ? 700 : 400} ${n}px "Space Mono", monospace`;
    const TOP = 170, HEAD = 190, rowsH = QUESTS.reduce((a, q) => a + (q[2] ? 92 : 66), 0), WH = HEAD + rowsH + 120, H = TOP + WH + 140;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const rr = (x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e6eef4'); g.addColorStop(.6, '#f1f0f0'); g.addColorStop(1, '#f6e6d6');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = 'rgba(160,180,195,.45)'; for (let y = 14; y < H; y += 30) for (let x = 14; x < W; x += 30) { c.beginPath(); c.arc(x, y, 1.6, 0, 7); c.fill(); }
    // window
    rr(X0 + 12, TOP + 14, WW, WH, 28); c.fillStyle = 'rgba(51,63,72,.16)'; c.fill();
    rr(X0, TOP, WW, WH, 28); c.fillStyle = '#fbfdff'; c.fill(); c.lineWidth = 6; c.strokeStyle = INK; c.stroke();
    rr(X0 + 12, TOP + 12, WW - 24, WH - 24, 20); c.lineWidth = 4; c.strokeStyle = '#c6d8e2'; c.stroke();
    rr(X0 + 34, TOP - 24, 230, 46, 10); c.fillStyle = INK; c.fill();
    c.font = PS(17); c.fillStyle = '#f1f7fb'; c.textAlign = 'left'; c.fillText('QUEST LOG', X0 + 54, TOP + 8);
    // heading
    let y = TOP + 92;
    c.font = PS(36); c.fillStyle = INK; c.fillText("tidalBYTE '26", L, y);
    c.font = PS(14); c.fillStyle = '#53616b'; c.textAlign = 'right'; c.fillText(QUESTS.length + ' QUESTS', R, y - 6);
    y += 44; c.textAlign = 'left'; c.font = MONO(23); c.fillStyle = '#53616b'; c.fillText('SAT · NOV 21 · MSC 2304', L, y);
    y += 30; c.strokeStyle = '#c6d8e2'; c.lineWidth = 4; c.setLineDash([12, 10]); c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); c.setLineDash([]);
    y += 16;
    const TAGC = { main: '#efd3b8', side: '#c6d8e2', food: '#cdd8cb', boss: INK };
    for (const [t, name, note, kind, icon, hi] of QUESTS) {
      const h = note ? 92 : 66;
      if (hi) { rr(L - 16, y + 4, R - L + 32, h - 8, 14); c.fillStyle = '#f9ebdc'; c.fill(); }
      const base = y + (note ? 40 : 42);
      c.font = PS(19); c.fillStyle = INK; c.textAlign = 'left'; c.fillText(t, L, base);
      c.fillStyle = '#e3edf6'; rr(L + 118, y + (h - 40) / 2, 40, 40, 8); c.fill();
      sprite(c, SPR[icon], L + 122 + (icon === 'mic' ? 10 : 0), y + (h - 40) / 2 + 4 + (icon === 'mic' ? 4 : 0), 2);
      c.font = MONO(26, 1); c.fillStyle = '#2c363e'; c.fillText(name, L + 180, base);
      if (note) { c.font = MONO(20); c.fillStyle = '#5e6b75'; c.fillText(note, L + 180, base + 30); }
      c.font = PS(13); const tw = c.measureText(TAG[kind]).width + 24, tx = R - tw, ty = y + h / 2 - 18;
      rr(tx, ty, tw, 34, 8); c.fillStyle = TAGC[kind]; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke();
      c.fillStyle = kind === 'boss' ? '#f9e4cf' : INK; c.textAlign = 'center'; c.fillText(TAG[kind], tx + tw / 2, ty + 24);
      y += h;
    }
    y += 26; c.strokeStyle = '#c6d8e2'; c.lineWidth = 4; c.setLineDash([12, 10]); c.beginPath(); c.moveTo(L, y); c.lineTo(R, y); c.stroke(); c.setLineDash([]);
    c.font = PS(14); c.fillStyle = '#53616b'; c.textAlign = 'center'; c.fillText('PRESS START · SEE YOU THERE ♥', W / 2, y + 52);
    sprite(c, SPR.pebble, X0 + WW - 140, TOP - 92, 6);
    const star = (x, yy, r) => { c.beginPath(); c.moveTo(x, yy - r); c.quadraticCurveTo(x, yy, x + r, yy); c.quadraticCurveTo(x, yy, x, yy + r); c.quadraticCurveTo(x, yy, x - r, yy); c.quadraticCurveTo(x, yy, x, yy - r);
      c.fillStyle = '#fbfdff'; c.fill(); c.lineWidth = 3; c.strokeStyle = INK; c.stroke(); };
    star(52, TOP + 160, 24); star(W - 46, TOP + WH * .5, 28); star(46, TOP + WH * .82, 16); star(X0 + 330, TOP - 70, 15);
    c.font = PS(15); c.fillStyle = '#53616b'; c.fillText("tidalBYTE '26 · TEXAS A&M · TIDAL", W / 2, H - 58);
    return new Promise(res => cv.toBlob(res, 'image/png'));
  }
  const saveBtn = $('#saveBtn'), saveDlg = $('#saveDlg');
  let saveUrl = null;
  listen(saveBtn, 'click', async () => {
    saveBtn.disabled = true;
    const blob = await questPNG();
    if (disposed || !blob) { saveBtn.disabled = false; return; }
    if (saveUrl) URL.revokeObjectURL(saveUrl);
    saveUrl = URL.createObjectURL(blob);
    $('#saveImg').src = saveUrl; $('#saveDl').href = saveUrl; $('#saveOpen').href = saveUrl;
    saveBtn.disabled = false; saveDlg.showModal();
  });
  listen($('#saveClose'), 'click', () => saveDlg.close());
  listen(saveDlg, 'click', e => { if (e.target === saveDlg) saveDlg.close(); });

  /* ---------------- STAGE 1-3 · inventory ---------------- */
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const glow = '<ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(241,247,251,.16)"/>';
  let keys = '';
  for (let rr = 0; rr < 3; rr++) for (let cc = 0; cc < 9; cc++) keys += `<rect x="${28 + cc * 16.3}" y="${96 + rr * 16}" width="12.5" height="12" rx="3" fill="${rr === 1 && cc === 4 ? '#efd3b8' : '#fbfdff'}" stroke="${INK}" stroke-width="1.6"/>`;
  const PRIZES = [
    ['1ST PLACE', 'electric scooters', 'one for every teammate (up to 4)', `${glow}
      <path d="M150 156 L132 46" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M150 156 L132 46" stroke="#c6d8e2" stroke-width="5" stroke-linecap="round"/>
      <path d="M112 44 H152" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M112 44 H152" stroke="#dfe7ee" stroke-width="4" stroke-linecap="round"/>
      <circle cx="112" cy="44" r="7" fill="#efd3b8" ${O}/><circle cx="152" cy="44" r="7" fill="#efd3b8" ${O}/>
      <rect x="36" y="146" width="118" height="15" rx="7.5" fill="#b4cadb" ${O}/><path d="M50 153 h80" stroke="#dfe7ee" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="170" r="17" fill="${PENG}" ${O}/><circle cx="50" cy="170" r="6" fill="#dfe7ee"/>
      <circle cx="152" cy="170" r="17" fill="${PENG}" ${O}/><circle cx="152" cy="170" r="6" fill="#dfe7ee"/>
      <circle cx="139" cy="84" r="6" fill="#f9e4cf" ${O}/>`],
    ['2ND PLACE', 'mechanical keyboards', 'thocky, hot-swappable, ×4', `${glow}
      <path d="M100 86 C100 58 140 64 134 26" fill="none" stroke="#c6d8e2" stroke-width="6" stroke-linecap="round"/>
      <rect x="16" y="84" width="168" height="82" rx="14" fill="#dfe7ee" ${O}/>${keys}
      <rect x="62" y="146" width="76" height="11" rx="3" fill="#fbfdff" stroke="${INK}" stroke-width="1.6"/>`],
    ['3RD PLACE', 'instant cameras', '+ a pack of film each', `${glow}
      <g transform="rotate(-9 90 60)"><rect x="52" y="22" width="76" height="62" rx="3" fill="#fbfdff" ${O}/><rect x="60" y="30" width="60" height="38" fill="#f9e4cf"/><circle cx="104" cy="44" r="7" fill="#efd3b8"/><path d="M60 68 L80 52 L94 62 L106 54 L120 68 Z" fill="#b4cadb"/></g>
      <rect x="28" y="66" width="144" height="108" rx="24" fill="#c6d8e2" ${O}/><path d="M28 146 H172" stroke="#b4cadb" stroke-width="8"/>
      <circle cx="100" cy="120" r="35" fill="${PENG}" ${O}/><circle cx="100" cy="120" r="22" fill="#2c363e" stroke="#9fb1be" stroke-width="3"/><circle cx="92" cy="112" r="6" fill="#fbfdff" opacity=".85"/>
      <rect x="42" y="78" width="28" height="17" rx="4" fill="#fbfdff" stroke="${INK}" stroke-width="2.5"/><circle cx="152" cy="86" r="7" fill="#efd3b8" stroke="${INK}" stroke-width="2.5"/>`],
    ['BEST BEGINNER HACK', 'drawing tablets', 'for your next big idea', `${glow}
      <g transform="rotate(-10 100 118)"><rect x="24" y="66" width="152" height="108" rx="16" fill="${PENG}" ${O}/><rect x="38" y="78" width="124" height="84" rx="6" fill="#e6f1f9"/>
      <path d="M52 140 q20 -44 42 -12 t44 -22" fill="none" stroke="#7fa7c4" stroke-width="5" stroke-linecap="round"/><circle cx="132" cy="104" r="9" fill="#f9e4cf"/></g>
      <g transform="rotate(32 150 80)"><rect x="144" y="18" width="13" height="92" rx="6.5" fill="#fbfdff" ${O}/><path d="M144 108 L150.5 126 L157 108 Z" fill="#efd3b8" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/></g>`],
    ['BEST DESIGN', 'retro handhelds', 'loaded with pixel-perfect vibes', `${glow}
      <rect x="54" y="20" width="92" height="156" rx="18" fill="#cdd8cb" ${O}/><rect x="64" y="32" width="72" height="62" rx="6" fill="${PENG}" ${O}/>
      <rect x="72" y="40" width="56" height="46" fill="#b4cadb"/><path d="${HEART}" transform="translate(89 52) scale(3)" fill="#fbfdff" shape-rendering="crispEdges"/>
      <path d="M74 124 h26 M87 111 v26" stroke="${PENG}" stroke-width="8"/><circle cx="118" cy="128" r="7.5" fill="#efd3b8" ${O}/><circle cx="131" cy="116" r="7.5" fill="#efd3b8" ${O}/>
      <path d="M84 156 l9 -4 M102 156 l9 -4" stroke="${PENG}" stroke-width="4" stroke-linecap="round"/>`],
    ["PEBBLE'S PICK", 'giant pebble plush', 'pebble picks personally. no appeals.', `${glow}
      <g transform="translate(100 182) scale(1.32)">
        <ellipse cx="-14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/><ellipse cx="14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/>
        <path d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z" fill="${PENG}"/>
        <path d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z" fill="#fbfdff"/>
        <ellipse cx="-21" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/><ellipse cx="23" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/>
        <ellipse cx="-13" cy="-80" rx="3.6" ry="3.2" fill="${PENG}"/><ellipse cx="15" cy="-80" rx="3.6" ry="3.2" fill="${PENG}"/>
        <ellipse cx="1" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke="${PENG}" stroke-width="2.6"/>
        <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill="${PENG}"/><path d="M38 -50 C54 -48 60 -32 54 -22 C50 -16 42 -22 38 -30 Z" fill="${PENG}"/>
      </g>`]
  ];

  const META = [
    ['LEGENDARY', '#efd3b8', 'for the 1st place team', 'zip across campus faster than a penguin in a cape. one for every teammate.', [['QTY', '×4 · up to 4'], ['TYPE', 'transport'], ['SPEED', 'very']]],
    ['EPIC', '#d9d6e3', 'for the 2nd place team', 'clicky, thocky and hot-swappable. your code will sound as good as it looks.', [['QTY', '×4 · up to 4'], ['TYPE', 'gear'], ['THOCK', 'maximum']]],
    ['RARE', '#c6d8e2', 'for the 3rd place team', 'snap your team photo the second you hit submit. comes with a pack of film each.', [['QTY', '×4 · up to 4'], ['TYPE', 'gear'], ['BONUS', 'film pack']]],
    ['SPECIAL', '#cdd8cb', 'best beginner hack', "for the team that's new to this and built something great anyway.", [['QTY', '×4 · up to 4'], ['TYPE', 'creative'], ['FOR', 'first-timers']]],
    ['SPECIAL', '#cdd8cb', 'best design', 'for the hack with the nicest pixels, flows and feels.', [['QTY', '×4 · up to 4'], ['TYPE', 'collectible'], ['STYLE', 'pixel-perfect']]],
    ['MYTHIC', '#f9e4cf', "pebble's pick", "pebble picks one project personally. no appeals. there is a fish involved.", [['QTY', '×1 · very huggable'], ['TYPE', 'plush'], ['JUDGE', 'pebble']]]
  ];
  const invGrid = $('#invGrid');
  invGrid.innerHTML = PRIZES.map(([rank, name, , art], i) => `<button class="islot" type="button" data-i="${i}" aria-pressed="${i === 0}" aria-label="${rank}: ${name}" style="--rc:${META[i][1]}">
      <svg viewBox="0 0 200 200" aria-hidden="true">${art}</svg><span class="gem" aria-hidden="true"></span></button>`).join('')
    + '<div class="islot locked" aria-hidden="true"><span>?</span></div>'.repeat(3)
    + '<p class="inv-note">? = more loot unlocks closer to nov 21</p>';
  const islots = $$('.islot:not(.locked)'), detail = $('#detail');
  function pick(i, focus) {
    const [rank, name, , art] = PRIZES[i], [rar, rc, who, desc, stats] = META[i];
    islots.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    $('#dArt').innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="${name}">${art}</svg><span class="shine"></span>`;
    detail.style.setProperty('--rc', rc);
    $('#dRar').textContent = rar + ' · ' + rank; $('#dName').textContent = name; $('#dWho').textContent = who; $('#dDesc').textContent = desc;
    $('#dStats').innerHTML = stats.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    detail.classList.remove('flash'); void detail.offsetWidth; detail.classList.add('flash');
    if (focus) islots[i].focus();
  }
  listen(invGrid, 'click', e => { const b = e.target.closest('.islot:not(.locked)'); if (b) pick(+b.dataset.i); });
  listen(invGrid, 'keydown', e => {
    const b = e.target.closest('.islot:not(.locked)'); if (!b) return;
    const i = +b.dataset.i, cols = getComputedStyle(invGrid).gridTemplateColumns.split(' ').length;
    const d = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (d === undefined) return; e.preventDefault();
    const n = i + d; if (n >= 0 && n < islots.length) pick(n, true);
  });
  pick(0);

  /* ---------------- faq: ask pebble ---------------- */
  const FAQ = [
    ['who can join?', "any student, any major, any level! never coded before? perfect — you're exactly who this is for ♪"],
    ['do i need a team?', "nope! come solo and we'll help you find teammates at the mixer. teams are up to 4."],
    ['is it free?', '100% free. food, swag and wifi are on us (well, on our sponsors).'],
    ['what do i bring?', 'a laptop, a charger, your student id, and one (1) idea. or zero ideas. we keep spares.'],
    ['is it overnight?', "nope, just 12 hours! you'll be home in bed before midnight."],
    ["who's pebble?", "it me! tidal's mascot. i hold a fish. that's mostly the job."]
  ];
  const faqCanvas = $('#faqCanvas'), faqCtx = faqCanvas.getContext('2d'), faqText = $('#faqText'), qs = $('#qs');
  let typing = null, hop = 0;
  function drawFaq(t) {
    const W = 120, H = 72; room(faqCtx, W, H, 56);
    const b = typing ? Math.round((Math.sin(t * 14) + 1)) : Math.round((Math.sin(t * 3) + 1) / 2);
    sprite(faqCtx, SPR.pebble, 44, 26 - b, 2);
    sprite(faqCtx, SPR.mic, 82, 38, 1);
    desk(faqCtx, 18, 102, 52, 72);
    sprite(faqCtx, SPR.heart, 4, 34, 1); sprite(faqCtx, SPR.cd, 100, 34, 1);
  }
  function say(text) {
    clearInterval(typing); faqText.textContent = '';
    if (reduce) { faqText.textContent = text; typing = null; return; }
    let i = 0;
    typing = setInterval(() => { faqText.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(typing); typing = null; } }, 26);
  }
  qs.innerHTML = FAQ.map(([q], i) => `<button class="qbtn" type="button" data-i="${i}" aria-pressed="false">${q}</button>`).join('');
  listen(qs, 'click', e => {
    const b = e.target.closest('.qbtn'); if (!b) return;
    $$('.qbtn').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    say(FAQ[+b.dataset.i][1]);
  });
  faqText.textContent = "hi! i'm pebble ♪ pick a question below and i'll answer!";

  /* ---------------- end: pebble at the computer ---------------- */
  const pcCanvas = $('#pcCanvas'), pcCtx = pcCanvas.getContext('2d');
  Object.assign(pcCanvas.style, { left: '22.4%', top: '12.7%', width: '48.1%', height: '41.2%' });
  function drawPc(t) {
    const c = pcCtx; c.fillStyle = '#44515a'; c.fillRect(0, 0, 64, 44);
    const cols = ['#cdd8cb', '#f9e4cf', '#c6d8e2', '#efd3b8'];
    const step = Math.floor(t * 3);
    for (let i = 0; i < 6; i++) {
      const n = (step + i) * 7919 % 97;
      c.fillStyle = cols[n % 4]; c.fillRect(4 + (n % 3) * 3, 4 + i * 5, 10 + n % 22, 2);
    }
    if (Math.floor(t * 2) % 2) { c.fillStyle = '#fbfdff'; c.fillRect(4, 34, 3, 3); }
    sprite(c, SPR.pebble, 44, 26 + (Math.floor(t * 6) % 2), 1);
  }


  /* ---------------- HUD: stage, items, clock ---------------- */
  const hud = $('#hud'), hudStage = $('#hudStage'), hudClock = $('#hudClock'), toastEl = $('#toast');
  const face = $('#hudFace').getContext('2d'); face.fillStyle = '#e3edf6'; face.fillRect(0, 0, 16, 16); sprite(face, SPR.pebble, 0, 1, 1);
  const STAGES = [['STAGE 1-1', 'meet pebble', 'heart', 'HERO BADGE'], ['STAGE 1-2', 'quest log', 'comic', 'QUEST LOG'], ['STAGE 1-3', 'player inventory', 'gem', 'LOOT GEM'],
    ['STAGE 1-4', 'powered by', 'heart', 'SPONSOR BADGE'], ['STAGE 1-5', 'ask pebble', 'fish', "PEBBLE'S FISH"], ['FINAL', 'save point', 'star', 'GOLD STAR']];
  const slotsEl = $('#slots');
  slotsEl.innerHTML = STAGES.map(([, , , item]) => `<span class="slot" title="${item}"><canvas width="16" height="16"></canvas></span>`).join('');
  const slotEls = $$('.slot');
  slotEls.forEach((s, i) => sprite(s.querySelector('canvas').getContext('2d'), SPR[STAGES[i][2]], 0, 0, 1));
  let got = -1, toastT = 0, shownStage = -1;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 1600); }
  const fmtClock = p => { const mins = Math.round((8 * 60 + p * (14 * 60 + 15)) / 5) * 5, h24 = Math.floor(mins / 60) % 24, m = mins % 60;
    return `${(h24 + 11) % 12 + 1}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`; };

  /* ---------------- the street ---------------- */
  const MARKS = [['about', '1-1', 'pebble'], ['schedule', '1-2', 'quests'], ['prizes', '1-3', 'loot'], ['sponsors', '1-4', 'sponsors'], ['faq', '1-5', 'faq'], ['register', '★', 'save']];
  const street = document.createElement('nav'); street.id = 'street'; street.setAttribute('aria-label', 'Stages');
  street.innerHTML = `<div class="road"><span class="lanes"></span></div>
    ${MARKS.map(([id, n, label]) => `<a class="post" href="#${id}" data-id="${id}"><span class="plate"><b>${n}</b><em>${label}</em></span><span class="pole"></span></a>`).join('')}
    <div class="walker" aria-hidden="true"><svg viewBox="-60 -150 130 160">
      <defs><pattern id="wDots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="#93b5cc"/></pattern></defs>
      <g class="w-cape"><path d="M-42 -59 Q-60 -40 -62 -12 Q-50 -4 -38 -8 Q-26 -2 -12 -6 Q4 0 18 -5 Q32 0 42 -6 Q50 -36 46 -60 Z" fill="#b4cadb" stroke="${PENG}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M-42 -59 Q-60 -40 -62 -12 Q-50 -4 -38 -8 Q-26 -2 -12 -6 Q4 0 18 -5 Q32 0 42 -6 Q50 -36 46 -60 Z" fill="url(#wDots)"/></g>
      <ellipse class="w-foot a" cx="-14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/>
      <ellipse class="w-foot b" cx="14" cy="-1" rx="10" ry="4.5" fill="#f9e4cf" stroke="${PENG}" stroke-width="2"/>
      <g class="w-body">
        <path d="M-36 -14 C-44 -46 -42 -96 -10 -114 C18 -126 44 -100 46 -60 C48 -40 44 -22 38 -12 C38 -2 30 4 18 3 C10 2 6 -2 0 -2 C-6 -2 -10 2 -18 3 C-30 4 -38 -2 -36 -14 Z" fill="${PENG}"/>
        <path d="M-28 -16 C-34 -40 -32 -74 -22 -88 C-14 -99 -4 -99 -2 -88 C-1 -83 -2 -79 -4 -77 L6 -77 C4 -79 3 -83 4 -88 C6 -99 18 -100 26 -88 C36 -72 38 -44 32 -18 C28 -8 18 -9 0 -9 C-16 -9 -26 -8 -28 -16 Z" fill="#fbfdff"/>
        <ellipse cx="-21" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/><ellipse cx="23" cy="-69" rx="6.5" ry="4.8" fill="#f9e4cf"/>
        <g class="w-eyes"><ellipse cx="-11" cy="-80" rx="3.6" ry="3.4" fill="${PENG}"/><ellipse cx="17" cy="-80" rx="3.6" ry="3.4" fill="${PENG}"/></g>
        <ellipse cx="3" cy="-74" rx="7.5" ry="4.6" fill="#f9e4cf" stroke="${PENG}" stroke-width="2.6"/>
        <path d="M-34 -50 C-50 -48 -56 -32 -50 -22 C-46 -16 -38 -22 -34 -30 Z" fill="${PENG}"/>
        <path d="M38 -50 C54 -48 60 -32 54 -22 C50 -16 42 -22 38 -30 Z" fill="${PENG}"/>
        <path d="M-42 -63 Q2 -51 47 -64 Q51 -60 47 -56 Q2 -43 -41 -55 Q-46 -59 -42 -63 Z" fill="#b4cadb" stroke="${PENG}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="${HEART}" transform="translate(-2.2,-54.5) scale(1.15)" fill="#7fa7c4" shape-rendering="crispEdges"/>
      </g>
    </svg></div>`;
  overlay.appendChild(street);
  const walker = street.querySelector('.walker'), posts = [...street.querySelectorAll('.post')];
  const secs = MARKS.map(([id]) => document.getElementById(id));
  listen(street, 'click', e => { const a = e.target.closest('.post'); if (!a) return; e.preventDefault();
    const s = document.getElementById(a.dataset.id); scrollTo({ top: (s.getBoundingClientRect().top + scrollY) + (a.dataset.id === 'about' ? innerHeight * .2 : 0), behavior: reduce ? 'auto' : 'smooth' }); });
  const PAD = 64;
  let arrive = [0, 1], startY = 0, endY = 1, heroEnd = 600;
  function layout() {
    if (disposed) return;
    heroEnd = document.getElementById('top').offsetHeight;
    startY = (secs[0].getBoundingClientRect().top + scrollY) - innerHeight * .25;
    endY = Math.max(startY + 1, document.documentElement.scrollHeight - innerHeight);
    const W = street.clientWidth, n = posts.length;
    arrive = secs.map((s, i) => i === 0 ? startY : Math.min(endY, (s.getBoundingClientRect().top + scrollY) - innerHeight * .25));
    for (let i = 1; i < n; i++) arrive[i] = Math.max(arrive[i], arrive[i - 1] + 1);
    arrive[n - 1] = Math.max(arrive[n - 1], endY);
    posts.forEach((p, i) => { const f = i / (n - 1); p.style.left = (PAD + f * (W - PAD * 2)) + 'px'; p.dataset.f = f; });
  }
  const onResize = () => { clearTimeout(layout.t); layout.t = setTimeout(layout, 150); };
  listen(window, 'resize', onResize);
  layout(); (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout); const layoutTimer = setTimeout(layout, 900);

  /* ---------------- one loop for everything ---------------- */
  const pcVis = $('#pcCanvas'), faqVis = $('#faqCanvas');
  let last = performance.now(), x = -1, facing = 1, step = 0, lastScene = 0, skyT = null, skyB = null, wpEase = -1;
  const vis = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  function frame(now) {
    if (disposed) return;
    const t = reduce ? 0 : now / 1000, dt = Math.min(.1, (now - last) / 1000); last = now;
    const y = scrollY, vh = innerHeight, W = street.clientWidth;

    // progress through the level: even steps between stages, however long each one is
    let wp = 0; const n = arrive.length;
    if (y <= arrive[0]) wp = 0; else if (y >= arrive[n - 1]) wp = 1;
    else for (let i = 0; i < n - 1; i++) if (y < arrive[i + 1]) { wp = (i + clamp((y - arrive[i]) / (arrive[i + 1] - arrive[i]))) / (n - 1); break; }
    if (wpEase < 0) wpEase = wp;
    wpEase += (wp - wpEase) * (reduce ? 1 : 1 - Math.exp(-dt * 3.2));

    // sky (eased, blended in OKLab)
    const [tTop, tBot] = skyAt(wpEase);
    skyT = tTop; skyB = tBot;
    sky.style.setProperty('--skyTop', rgb(skyT)); sky.style.setProperty('--skyBot', rgb(skyB));
    const night = smooth(.86, .99, wpEase), k = clamp(wpEase / .84);
    sky.style.setProperty('--night', night.toFixed(3));
    sky.style.setProperty('--sunX', (10 + k * 74).toFixed(2) + '%');
    sky.style.setProperty('--sunY', (k < .45 ? 30 - 20 * Math.sin(Math.PI * k / .9) : 10 + Math.pow((k - .45) / .55, 1.5) * 92).toFixed(2) + '%');
    sky.style.setProperty('--sunCore', rgb(mix(ok('#fdf6ec'), ok('#f6c9a4'), smooth(.45, 1, k))));
    sky.style.setProperty('--sunA', (1 - smooth(.9, 1, k)).toFixed(3));
    root.classList.toggle('is-night', wpEase > .93);

    // HUD + street
    const past = y > heroEnd - vh * .35;
    hud.classList.toggle('show', past); street.classList.toggle('show', past);
    const si = Math.min(STAGES.length - 1, Math.floor(wp * (n - 1) + .02));
    if (past && si !== shownStage) { shownStage = si; hudStage.innerHTML = `<b>${STAGES[si][0]}</b>${STAGES[si][1]}`; }
    const reach = y < startY ? -1 : si;
    if (reach > got) { for (let i = got + 1; i <= reach; i++) slotEls[i].classList.add('got'); toast('+ ' + STAGES[reach][3]); got = reach; }
    hudClock.textContent = fmtClock(wpEase);

    const tx = PAD + wp * (W - PAD * 2);
    if (x < 0) x = tx;
    const prev = x;
    x += (tx - x) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
    const v = (x - prev) / Math.max(dt, .001);
    if (Math.abs(v) > 8) { facing = v > 0 ? 1 : -1; step += Math.abs(v) * dt * .09; }
    const walking = Math.abs(v) > 8 && !reduce;
    walker.classList.toggle('walking', walking);
    walker.style.transform = `translateX(${(x - walker.offsetWidth / 2).toFixed(1)}px) translateY(${walking ? (-Math.abs(Math.sin(step * Math.PI)) * 4).toFixed(1) : 0}px) scaleX(${facing})`;
    walker.style.setProperty('--step', (Math.sin(step * Math.PI) * 4).toFixed(2) + 'px');
    walker.style.setProperty('--stepb', (-Math.sin(step * Math.PI) * 4).toFixed(2) + 'px');
    walker.style.setProperty('--sway', (walking ? Math.sin(step * Math.PI) * 5 : 0).toFixed(2) + 'deg');
    let cur = 0; posts.forEach((pt, i) => { if (+pt.dataset.f <= wp + .005) cur = i; });
    posts.forEach((pt, i) => { pt.classList.toggle('passed', i <= cur); pt.classList.toggle('here', Math.abs(+pt.dataset.f - wp) < .03); });

    const ar = aboutSec.getBoundingClientRect();

    // little pixel scenes (cheap; a few times a second)
    if (now - lastScene > 140) {
      lastScene = now;
      if (ar.top < vh && ar.bottom > 0) aboutCanvases.forEach(cv => aboutScene(cv, cv.parentNode.dataset.scene, t));
      if (vis(giver)) drawGiver(t);
      if (vis(faqVis)) drawFaq(t);
      if (vis(pcVis)) drawPc(t);
    }
    raf = requestAnimationFrame(frame);
  }
  aboutCanvases.forEach(cv => aboutScene(cv, cv.parentNode.dataset.scene, 0));
  drawGiver(0); drawFaq(0); drawPc(0);
  raf = requestAnimationFrame(frame);

  return () => {
    disposed = true;
    events.abort();
    cancelAnimationFrame(raf);
    clearTimeout(layoutTimer);
    clearTimeout(layout.t);
    clearTimeout(toastT);
    clearInterval(typing);
    window.removeEventListener('resize', onResize);
    aboutIO.disconnect();
    qIO.disconnect();
    if (saveUrl) URL.revokeObjectURL(saveUrl);
    saveDlg.close();
    street.remove();
  };
}
