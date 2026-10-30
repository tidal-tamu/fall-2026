import { QUESTS, EVENT, fmtCentral } from "./event";
import { paintSprite } from "./PixelArt";

const INK = "#333f48";

const TAG = { main: "MAIN", side: "SIDE", food: "FOOD", boss: "BOSS" };
// Draw the same quest data as the React list onto a shareable image.
export async function createQuestLog(): Promise<Blob | null> {
    try {
        await Promise.all(['20px "Press Start 2P"', '400 20px "Space Mono"', '700 20px "Space Mono"'].map(f => document.fonts.load(f)));
    }
    catch { /* The system monospace fallback can still render the export. */ }
    const width = 1080;
    const windowLeft = 80;
    const windowWidth = width - 160;
    const padding = 54;
    const contentLeft = windowLeft + padding;
    const contentRight = windowLeft + windowWidth - padding;
    const pixelFont = (n: number) => `${n}px "Press Start 2P", monospace`;
    const monoFont = (n: number, b = false) => `${b ? 700 : 400} ${n}px "Space Mono", monospace`;
    const windowTop = 170;
    const headerHeight = 190;
    const rowsHeight = QUESTS.reduce((a, q) => a + (q.note ? 92 : 66), 0);
    const windowHeight = headerHeight + rowsHeight + 120;
    const height = windowTop + windowHeight + 140;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context)
        throw new Error('Your browser could not create the quest log image.');
    const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
        context.beginPath();
        if (context.roundRect)
            context.roundRect(x, y, w, h, r);
        else
            context.rect(x, y, w, h);
    };
    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, '#e6eef4');
    background.addColorStop(.6, '#f1f0f0');
    background.addColorStop(1, '#f6e6d6');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'rgba(160,180,195,.45)';
    for (let y = 14;y < height;y += 30) {
        for (let x = 14;x < width;x += 30) {
            context.beginPath();
            context.arc(x, y, 1.6, 0, 7);
            context.fill();
        }
    }
    // window
    roundedRect(windowLeft + 12, windowTop + 14, windowWidth, windowHeight, 28);
    context.fillStyle = 'rgba(51,63,72,.16)';
    context.fill();
    roundedRect(windowLeft, windowTop, windowWidth, windowHeight, 28);
    context.fillStyle = '#fbfdff';
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = INK;
    context.stroke();
    roundedRect(windowLeft + 12, windowTop + 12, windowWidth - 24, windowHeight - 24, 20);
    context.lineWidth = 4;
    context.strokeStyle = '#c6d8e2';
    context.stroke();
    roundedRect(windowLeft + 34, windowTop - 24, 230, 46, 10);
    context.fillStyle = INK;
    context.fill();
    context.font = pixelFont(17);
    context.fillStyle = '#f1f7fb';
    context.textAlign = 'left';
    context.fillText('QUEST LOG', windowLeft + 54, windowTop + 8);
    // heading
    let y = windowTop + 92;
    context.font = pixelFont(36);
    context.fillStyle = INK;
    context.fillText("tidalBYTE '26", contentLeft, y);
    context.font = pixelFont(14);
    context.fillStyle = '#53616b';
    context.textAlign = 'right';
    context.fillText(QUESTS.length + ' QUESTS', contentRight, y - 6);
    y += 44;
    context.textAlign = 'left';
    context.font = monoFont(23);
    context.fillStyle = '#53616b';
    const dateLine = fmtCentral(EVENT.startsAt, { weekday: "short", month: "short", day: "numeric" }).toUpperCase().replace(",", " ·");
    context.fillText(`${dateLine} · ${EVENT.room}`, contentLeft, y);
    y += 30;
    context.strokeStyle = '#c6d8e2';
    context.lineWidth = 4;
    context.setLineDash([12, 10]);
    context.beginPath();
    context.moveTo(contentLeft, y);
    context.lineTo(contentRight, y);
    context.stroke();
    context.setLineDash([]);
    y += 16;
    const tagColors = { main: '#efd3b8', side: '#c6d8e2', food: '#cdd8cb', boss: INK };
    for (const { time: time, name, note, kind, icon, highlight: highlight } of QUESTS) {
        const h = note ? 92 : 66;
        if (highlight) {
            roundedRect(contentLeft - 16, y + 4, contentRight - contentLeft + 32, h - 8, 14);
            context.fillStyle = '#f9ebdc';
            context.fill();
        }
        const base = y + (note ? 40 : 42);
        context.font = pixelFont(19);
        context.fillStyle = INK;
        context.textAlign = 'left';
        context.fillText(time, contentLeft, base);
        context.fillStyle = '#e3edf6';
        roundedRect(contentLeft + 118, y + (h - 40) / 2, 40, 40, 8);
        context.fill();
        paintSprite(context, icon, contentLeft + 122 + (icon === 'mic' ? 10 : 0), y + (h - 40) / 2 + 4 + (icon === 'mic' ? 4 : 0), 2);
        context.font = monoFont(26, true);
        context.fillStyle = '#2c363e';
        context.fillText(name, contentLeft + 180, base);
        if (note) {
            context.font = monoFont(20);
            context.fillStyle = '#5e6b75';
            context.fillText(note, contentLeft + 180, base + 30);
        }
        context.font = pixelFont(13);
        const tagWidth = context.measureText(TAG[kind]).width + 24;
        const tagX = contentRight - tagWidth;
        const tagY = y + h / 2 - 18;
        roundedRect(tagX, tagY, tagWidth, 34, 8);
        context.fillStyle = tagColors[kind];
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = INK;
        context.stroke();
        context.fillStyle = kind === 'boss' ? '#f9e4cf' : INK;
        context.textAlign = 'center';
        context.fillText(TAG[kind], tagX + tagWidth / 2, tagY + 24);
        y += h;
    }
    y += 26;
    context.strokeStyle = '#c6d8e2';
    context.lineWidth = 4;
    context.setLineDash([12, 10]);
    context.beginPath();
    context.moveTo(contentLeft, y);
    context.lineTo(contentRight, y);
    context.stroke();
    context.setLineDash([]);
    context.font = pixelFont(14);
    context.fillStyle = '#53616b';
    context.textAlign = 'center';
    context.fillText('PRESS START · SEE YOU THERE ♥', width / 2, y + 52);
    paintSprite(context, "pebble", windowLeft + windowWidth - 140, windowTop - 92, 6);
    const star = (x: number, centerY: number, r: number) => {
        context.beginPath();
        context.moveTo(x, centerY - r);
        context.quadraticCurveTo(x, centerY, x + r, centerY);
        context.quadraticCurveTo(x, centerY, x, centerY + r);
        context.quadraticCurveTo(x, centerY, x - r, centerY);
        context.quadraticCurveTo(x, centerY, x, centerY - r);
        context.fillStyle = '#fbfdff';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = INK;
        context.stroke();
    };
    star(52, windowTop + 160, 24);
    star(width - 46, windowTop + windowHeight * .5, 28);
    star(46, windowTop + windowHeight * .82, 16);
    star(windowLeft + 330, windowTop - 70, 15);
    context.font = pixelFont(15);
    context.fillStyle = '#53616b';
    context.fillText("tidalBYTE '26 · TEXAS A&M · TIDAL", width / 2, height - 58);
    return new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
}
