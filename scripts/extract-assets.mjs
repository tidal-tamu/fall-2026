// One-off: extract base64 assets from the tidalbyte prototype HTML into public/f26/
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";

const SRC = `${homedir()}/Downloads/tidalbyte-prototype.html`;
const OUT = new URL("../public/f26/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// line number (1-based) -> output filename
const MAP = {
    501: "loader.gif",
    527: "hero-girl.webp",
    569: "seal.webp",
    594: "doodle-panda.webp",
    601: "doodle-cat.webp",
    636: "sched-penguin-headphones.webp",
    637: "cow.webp",
    638: "sched-mascot.webp",
    639: "doodle-cat-2.webp",
    653: "prize-bunny.webp",
    658: "pebbleman.webp",
    663: "pebblecute.webp",
};

const lines = readFileSync(SRC, "utf8").split("\n");
for (const [ln, name] of Object.entries(MAP)) {
    const line = lines[ln - 1];
    const m = line.match(/data:image\/(?:gif|webp|png);base64,([^"]+)/);
    if (!m) {
        console.error(`no data URI on line ${ln}`);
        process.exitCode = 1;
        continue;
    }
    writeFileSync(OUT + name, Buffer.from(m[1], "base64"));
    console.log(`${name}: ${Math.round(m[1].length * 0.75 / 1024)} KB`);
}
