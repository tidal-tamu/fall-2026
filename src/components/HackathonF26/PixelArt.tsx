import { useEffect, useRef, type CanvasHTMLAttributes } from "react";
import { useReducedMotion } from "framer-motion";

const palette: Record<string, string> = {
    k: '#44515a', e: '#1f262c', w: '#fbfdff', c: '#f9e4cf', b: '#b4cadb', h: '#7fa7c4', g: '#cdd8cb',
    p: '#efd3b8', v: '#c6d8e2', s: '#dfe7ee', o: '#333f48', r: '#f3d2c4', n: '#9fb1be'
};

const sprites: Record<string, string[]> = {
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
    hs.forEach((row, j) => [...row].forEach((ch, i) => {
        if (ch === 'X')
            for (let a = 0;a < 2;a++) {
                for (let b = 0;b < 2;b++) {
                    g[1 + j * 2 + a][1 + i * 2 + b] = 'h';
                }
            }
    }));
    g[3][4] = g[3][5] = g[4][4] = 'w';
    const o = g.map(r => r.slice());
    for (let y = 0;y < 16;y++) {
        for (let x = 0;x < 16;x++) {
            if (g[y][x] === '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy]?.[x + dx] && g[y + dy][x + dx] !== '.'))
                o[y][x] = 'k';
        }
    }
    sprites.heart = o.map(r => r.join(''));
    const iri = ['v', 'c', 'g', 'w', 'p', 'v'];
    sprites.cd = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => {
        const dx = x - 7.5;
        const dy = y - 7.5;
        const d = Math.hypot(dx, dy);
        if (d > 7.6)
            return '.';
        if (d > 6.7)
            return 'k';
        if (d < 1.3)
            return '.';
        if (d < 2.3)
            return 'k';
        if (d < 3.4)
            return 's';
        return iri[Math.floor(((Math.atan2(dy, dx) + Math.PI) / (Math.PI * 2)) * 6) % 6];
    }).join(''));
    sprites.clock = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => {
        const dx = x - 7.5;
        const dy = y - 7.5;
        const d = Math.hypot(dx, dy);
        if (d > 7.4)
            return '.';
        if (d > 6.4)
            return 'k';
        if ((x === 7 || x === 8) && y >= 3 && y <= 8)
            return 'k';
        if ((y === 7 || y === 8) && x >= 8 && x <= 11)
            return 'k';
        if (d > 5.6 && (x === 7 || x === 8 || y === 7 || y === 8))
            return 'n';
        return 'w';
    }).join(''));
    sprites.mic = ['.....', '.ppp.', 'ppppp', 'ppppp', '.ppp.', '..k..', '..k..', '..k..', '..k..', '..k..', '..k..', '.kkk.', 'kkkkk'];
})();

export function drawSprite(ctx: CanvasRenderingContext2D, rows: string[], x: number, y: number, s = 1) {
    rows.forEach((row, j) => [...row].forEach((ch, i) => {
        if (ch === '.')
            return;
        ctx.fillStyle = palette[ch];
        ctx.fillRect(x + i * s, y + j * s, s, s);
    }));
}
/* little GBA-cutscene rooms for pebble */

function room(ctx: CanvasRenderingContext2D, W: number, H: number, floorY: number) {
    ctx.fillStyle = '#e3edf6';
    ctx.fillRect(0, 0, W, H);
    for (let y = 3;y < floorY - 4;y += 10) {
        for (let x = (y % 20 ? 4 : 9);x < W;x += 14) {
            ctx.fillStyle = '#cfdde9';
            ctx.fillRect(x, y + 1, 3, 1);
            ctx.fillRect(x + 1, y, 1, 3);
        }
    }
    ctx.fillStyle = '#f9e4cf';
    ctx.fillRect(0, floorY, W, H - floorY);
    ctx.fillStyle = '#efd3b8';
    for (let x = 0;x < W;x += 8) {
        ctx.fillRect(x, floorY + 4, 4, 1);
    }
    ctx.fillStyle = '#b9cad7';
    ctx.fillRect(0, floorY - 1, W, 1);
}

function desk(ctx: CanvasRenderingContext2D, x0: number, x1: number, y0: number, y1: number) {
    ctx.fillStyle = palette.k;
    ctx.fillRect(x0 + 2, y0 - 1, x1 - x0 - 4, 1);
    ctx.fillStyle = '#b4cadb';
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.fillRect(x0 + 2, y0 - 1, x1 - x0 - 4, 1);
    ctx.fillStyle = palette.k;
    ctx.fillRect(x0, y0, 1, y1 - y0);
    ctx.fillRect(x1 - 1, y0, 1, y1 - y0);
    ctx.fillRect(x0 + 1, y0 - 1, x1 - x0 - 2, 1);
    ctx.fillStyle = '#fbfdff';
    for (let y = y0 + 3;y < y1;y += 5) {
        for (let x = x0 + 4 + (y % 2) * 3;x < x1 - 3;x += 7) {
            ctx.fillRect(x, y, 2, 2);
        }
    }
}

function aboutScene(canvas: HTMLCanvasElement, kind: string, t: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    const W = 96;
    const H = 48;
    const bob = Math.round((Math.sin(t * 5) + 1) / 2);
    room(ctx, W, H, 38);
    const px = kind === 'pebble' ? 38 : 30;
    drawSprite(ctx, sprites.pebble, px, 18 - bob, 1);
    if (kind === 'pebble') {
        drawSprite(ctx, sprites.fish.map(r => r), 52, 13 - bob, 1);
        drawSprite(ctx, sprites.mic, 66, 22, 1);
    }
    if (kind === 'tidal')
        drawSprite(ctx, sprites.laptop, 48, 21, 1);
    if (kind === 'byte') {
        drawSprite(ctx, sprites.clock, 52, 16, 1);
        drawSprite(ctx, sprites.heart, 68, 20 - bob, 1);
    }
    desk(ctx, 16, 80, 33, 48);
}
/* extra item sprites */
sprites.gem = ['................', '................', '....kkkkkkkk....', '...kvwwvvvvbk...', '..kvwwvvvvvbbk..', '.kkkkkkkkkkkkkk.', '.kbvvwwvvvvbbhk.', '..kbvwwvvvbbhk..',
    '...kbvwvvbbhk...', '....kbvvbbhk....', '.....kbvbhk.....', '......kbhk......', '.......kk.......', '................', '................', '................'];
(() => {
    const pts: number[][] = [];
    for (let i = 0;i < 10;i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const r = i % 2 ? 3.1 : 7.4;
        pts.push([7.5 + Math.cos(a) * r, 8.3 + Math.sin(a) * r]);
    }
    const inside = (x: number, y: number) => {
        let c = false;
        for (let i = 0, j = pts.length - 1;i < pts.length;j = i++) {
            const [xi, yi] = pts[i];
            const [xj, yj] = pts[j];
            if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi)
                c = !c;
        }
        return c;
    };
    const g: string[][] = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => inside(x + .5, y + .5) ? 'c' : '.'));
    const o = g.map(r => r.slice());
    for (let y = 0;y < 16;y++) {
        for (let x = 0;x < 16;x++) {
            if (g[y][x] === '.' && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy]?.[x + dx] === 'c'))
                o[y][x] = 'k';
        }
    }
    o[6][6] = o[7][6] = o[6][7] = 'w';
    sprites.star = o.map(r => r.join(''));
})();

export function paintSprite(ctx: CanvasRenderingContext2D, name: string, x = 0, y = 0, scale = 1) {
    drawSprite(ctx, sprites[name], x, y, scale);
}

function drawGiver(ctx: CanvasRenderingContext2D, t: number) {
    const c = ctx;
    const b = Math.round((Math.sin(t * 4) + 1) / 2);
    c.fillStyle = '#e3edf6';
    c.fillRect(0, 0, 48, 48);
    for (let y = 4;y < 34;y += 10) {
        for (let x = (y % 20 ? 4 : 9);x < 48;x += 14) {
            c.fillStyle = '#cfdde9';
            c.fillRect(x, y + 1, 3, 1);
            c.fillRect(x + 1, y, 1, 3);
        }
    }
    c.fillStyle = '#f9e4cf';
    c.fillRect(0, 38, 48, 10);
    c.fillStyle = '#b9cad7';
    c.fillRect(0, 37, 48, 1);
    drawSprite(c, sprites.pebble, 16, 22 - b, 1);
    drawSprite(c, sprites.comic, 30, 24 - b, 1);
}

function drawFaq(ctx: CanvasRenderingContext2D, t: number, talking = false) {
    const W = 120;
    const H = 72;
    room(ctx, W, H, 56);
    const b = talking ? Math.round((Math.sin(t * 14) + 1)) : Math.round((Math.sin(t * 3) + 1) / 2);
    drawSprite(ctx, sprites.pebble, 44, 26 - b, 2);
    drawSprite(ctx, sprites.mic, 82, 38, 1);
    desk(ctx, 18, 102, 52, 72);
    drawSprite(ctx, sprites.heart, 4, 34, 1);
    drawSprite(ctx, sprites.cd, 100, 34, 1);
}

function drawPc(ctx: CanvasRenderingContext2D, t: number) {
    const c = ctx;
    c.fillStyle = '#44515a';
    c.fillRect(0, 0, 64, 44);
    const cols = ['#cdd8cb', '#f9e4cf', '#c6d8e2', '#efd3b8'];
    const step = Math.floor(t * 3);
    for (let i = 0;i < 6;i++) {
        const n = (step + i) * 7919 % 97;
        c.fillStyle = cols[n % 4];
        c.fillRect(4 + (n % 3) * 3, 4 + i * 5, 10 + n % 22, 2);
    }
    if (Math.floor(t * 2) % 2) {
        c.fillStyle = '#fbfdff';
        c.fillRect(4, 34, 3, 3);
    }
    drawSprite(c, sprites.pebble, 44, 26 + (Math.floor(t * 6) % 2), 1);
}

type PixelCanvasProps = Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "children"> & {
    sprite?: string;
    scene?: "pebble" | "tidal" | "byte" | "giver" | "faq" | "pc";
    talking?: boolean;
};

export default function PixelCanvas({ sprite, scene, talking = false, ...props }: PixelCanvasProps) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const reduce = useReducedMotion();
    useEffect(() => {
        const element = canvas.current;
        const context = element?.getContext("2d");
        if (!element || !context)
            return;
        let visible = true;
        const paint = () => {
            if (!visible)
                return;
            const time = reduce ? 0 : performance.now() / 1000;
            context.clearRect(0, 0, element.width, element.height);
            if (sprite) {
                context.fillStyle = "#e3edf6";
                context.fillRect(0, 0, element.width, element.height);
                paintSprite(context, sprite, sprite === "mic" ? 5 : 0, sprite === "mic" ? 2 : 0);
            }
            else if (scene === "giver")
                drawGiver(context, time);
            else if (scene === "faq")
                drawFaq(context, time, talking);
            else if (scene === "pc")
                drawPc(context, time);
            else if (scene)
                aboutScene(element, scene, time);
        };
        paint();
        if (reduce || !scene)
            return;
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
        observer.observe(element);
        const timer = window.setInterval(paint, 140);
        return () => { observer.disconnect(); window.clearInterval(timer); };
    }, [sprite, scene, talking, reduce]);
    return <canvas ref={canvas} aria-hidden="true" {...props} />;
}
