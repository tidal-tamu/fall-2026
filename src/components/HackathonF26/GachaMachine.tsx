import { useRef, useState } from "react";
import { useCoins } from "./coinEconomy";

/* Interactive gacha: PLAY (1 coin) pops a random capsule into the tray,
   REFRESH (10 coins) restocks the glass. Coins come from the pac-man
   trail — see coinEconomy. */

const CAP_COLORS = ["#FF9DE2", "#7B7BF0", "#9BE8D8", "#FFD84D", "#B23BFF", "#FF6E3A"];
const CHARACTERS = [
    "/f26/pebblecute.webp",
    "/f26/pebbleman.webp",
    "/f26/cow.webp",
];

interface Capsule {
    id: number;
    color: string;
    rot: number;
    left: number;
    top: number;
    img: string;
    popped: boolean;
}

let capsuleId = 0;
const makeCapsules = (): Capsule[] =>
    Array.from({ length: 8 }, (_, i) => ({
        id: capsuleId++,
        color: CAP_COLORS[i % CAP_COLORS.length],
        rot: Math.random() * 50 - 25,
        left: 6 + Math.random() * 72,
        top: 38 + Math.random() * 46,
        img: CHARACTERS[i % CHARACTERS.length],
        popped: false,
    }));

const GachaMachine = () => {
    const { balance, hudRef, spend, collect } = useCoins();
    const [capsules, setCapsules] = useState<Capsule[]>(makeCapsules);
    const [shaking, setShaking] = useState(false);
    const [knobTurned, setKnobTurned] = useState(false);
    const [note, setNote] = useState<string | null>(null);
    const noteTimer = useRef<ReturnType<typeof setTimeout>>();

    const flashNote = (msg: string) => {
        setNote(msg);
        clearTimeout(noteTimer.current);
        noteTimer.current = setTimeout(() => setNote(null), 2400);
    };

    const shakeFx = () => {
        setShaking(true);
        setKnobTurned(true);
        setTimeout(() => {
            setShaking(false);
            setKnobTurned(false);
        }, 920);
    };

    const playGacha = () => {
        if (!spend(1)) {
            flashNote("need 1 coin — scroll to collect ↓");
            return;
        }
        shakeFx();
        setTimeout(() => {
            setCapsules((caps) => {
                const alive = caps.filter((c) => !c.popped);
                if (!alive.length) {
                    flashNote("machine empty! hit refresh ↻");
                    return caps;
                }
                const winner = alive[Math.floor(Math.random() * alive.length)];
                collect(winner.img);
                flashNote("sticker collected! →");
                return caps.map((c) =>
                    c.id === winner.id ? { ...c, popped: true } : c,
                );
            });
        }, 420);
    };

    const refreshGacha = () => {
        if (!spend(10)) {
            flashNote("need 10 coins to restock");
            return;
        }
        setShaking(true);
        setTimeout(() => setShaking(false), 520);
        setCapsules(makeCapsules());
        flashNote("capsules restocked ✦");
    };

    return (
        <>
            <div className="gacha-wrap">
                <div className={`gacha ${shaking ? "shake" : ""}`}>
                    <div className="gacha-sign px">REGISTER</div>
                    <div className="gacha-glass">
                        {capsules.map((c, i) => (
                            <div
                                key={c.id}
                                className={`capsule ${c.popped ? "pop" : ""}`}
                                style={
                                    {
                                        "--cap": c.color,
                                        "--rot": `${c.rot}deg`,
                                        "--i": i,
                                        left: `${c.left}%`,
                                        top: `${c.top}%`,
                                    } as React.CSSProperties
                                }
                            >
                                <img src={c.img} alt="capsule prize" />
                            </div>
                        ))}
                    </div>
                    <div className="gacha-belly">
                        <div className="coin-slot px">1 COIN!</div>
                        <div
                            className={`knob ${knobTurned ? "turn" : ""}`}
                            title="turn me!"
                            onClick={playGacha}
                        />
                    </div>
                    <div className="gacha-chute" />
                    <div className={`pop-note ${note ? "show" : ""}`}>{note}</div>
                </div>
            </div>
            <div className="gacha-btns">
                <div className="coin-hud" ref={hudRef}>
                    <span className="coin-ico" />
                    <span>COINS:</span>
                    <BalanceNumber value={balance} />
                </div>
                <button className="gbtn reg" onClick={playGacha} disabled={balance < 1}>
                    ▶ PLAY<small>1 coin — win a sticker</small>
                </button>
                <button className="gbtn" onClick={refreshGacha} disabled={balance < 10}>
                    ↻ REFRESH<small>10 coins — restock capsules</small>
                </button>
            </div>
        </>
    );
};

/* re-triggers the bump animation whenever the balance changes */
const BalanceNumber = ({ value }: { value: number }) => (
    <span key={value} className="n bump">
        {value}
    </span>
);

export default GachaMachine;
