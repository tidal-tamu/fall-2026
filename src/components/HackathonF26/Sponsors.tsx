import { useEffect, useState } from "react";
import Sticker from "./Sticker";

/* Sponsor wall: a pile of retro CRT TVs whose screens flicker on and off.
   Logos are text placeholders until real sponsor assets land. */

interface Sponsor {
    n: string;
    c: string;
    row: number;
    w: number;
    h: number;
    tilt?: number;
    ant?: boolean;
}

const SPONSORS: Sponsor[] = [
    { n: "Google", c: "#8AB4F8", row: 0, w: 200, h: 120 },
    { n: "NVIDIA", c: "#76B900", row: 0, w: 180, h: 130, tilt: -2 },
    { n: "Jane Street", c: "#F0EEFA", row: 0, w: 210, h: 110, tilt: 1.5 },
    { n: "Figma", c: "#FF7262", row: 1, w: 230, h: 140, tilt: 1, ant: true },
    { n: "Netflix", c: "#E50914", row: 1, w: 250, h: 150, tilt: -1.5 },
    { n: "Framer", c: "#7B7BF0", row: 2, w: 300, h: 150, tilt: 0.6 },
];

const Tv = ({ sponsor, index }: { sponsor: Sponsor; index: number }) => {
    const [lit, setLit] = useState(false);

    // staggered random flicker, like a wall of half-working CRTs
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        let alive = true;
        const cycle = () => {
            if (!alive) return;
            setLit((l) => !l);
            timer = setTimeout(cycle, 1200 + Math.random() * 2200);
        };
        timer = setTimeout(cycle, index * 420);
        return () => {
            alive = false;
            clearTimeout(timer);
        };
    }, [index]);

    const { n, c, w, h, tilt, ant } = sponsor;
    return (
        <div
            className={`tv ${lit ? "lit" : ""}`}
            style={{ width: w, height: h, transform: `rotate(${tilt || 0}deg)` }}
        >
            {ant && <div className="antenna" />}
            <div
                className="glow"
                style={{ boxShadow: `0 0 34px ${c}66, 0 0 70px ${c}33` }}
            />
            <div className="screen">
                <span className="logo" style={{ color: c, textShadow: `0 0 14px ${c}` }}>
                    {n}
                </span>
            </div>
            <div className="knobs"><i /><i /></div>
        </div>
    );
};

const Sponsors = () => {
    const rows: Sponsor[][] = [[], [], []];
    SPONSORS.forEach((s) => rows[s.row].push(s));
    let idx = 0;

    return (
        <section id="sponsors">
            <div className="sec-head">
                <div className="eyebrow px">POWERED BY</div>
                <h2 className="px">SPONSORS</h2>
                <div className="hand">a pile of light-up TVs, obviously</div>
            </div>
            <Sticker tilt="0deg">
                <div className="tv-pile">
                    <div className="tv-rows">
                        {rows.map((row, r) => (
                            <div className="tv-row" key={r}>
                                {row.map((s) => (
                                    <Tv key={s.n} sponsor={s} index={idx++} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Sticker>
            <p className="hand-note" style={{ textAlign: "center", marginTop: 34 }}>
                screens glow on + off ✦ logos are placeholders for now
            </p>
        </section>
    );
};

export default Sponsors;
