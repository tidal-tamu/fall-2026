import { ReactNode } from "react";
import Sticker from "./Sticker";

/* Spiral notebook two-page spread with sticker doodles in the margins. */

interface ScheduleItem {
    t: string;
    d: ReactNode;
    tag?: string;
}

const DAY_1: ScheduleItem[] = [
    { t: "09:00", d: "check-in + lanyards" },
    { t: "10:00", d: "opening ceremony", tag: "gym" },
    { t: "11:00", d: "team formation mixer" },
    { t: "12:00", d: "HACKING BEGINS ⚔" },
    { t: "15:00", d: "intro to git workshop", tag: "rm 204" },
    { t: "19:00", d: "dinner + trivia" },
    { t: "23:59", d: "midnight ramen 🍜" },
];

const DAY_2: ScheduleItem[] = [
    { t: "02:00", d: "3am karaoke (optional, brave)" },
    { t: "08:00", d: "breakfast + rubber duck station" },
    { t: "12:00", d: "HANDS OFF KEYBOARDS" },
    { t: "12:30", d: "demo expo", tag: "gym" },
    { t: "14:30", d: "judging" },
    { t: "16:00", d: "awards + plushie rain" },
];

const Page = ({
    side,
    title,
    items,
    tilt,
    children,
}: {
    side: "left" | "right";
    title: string;
    items: ScheduleItem[];
    tilt: string;
    children?: ReactNode;
}) => (
    <Sticker tilt={tilt}>
        <div className={`page ${side}`}>
            <h3 className="px">{title}</h3>
            {items.map(({ t, d, tag }) => (
                <div className="sched-item" key={t}>
                    <span className="t">{t}</span>
                    <span className="d">{d}</span>
                    {tag && <span className="tag">{tag}</span>}
                </div>
            ))}
            {children}
        </div>
    </Sticker>
);

const Schedule = () => (
    <section id="schedule">
        <div className="sec-head">
            <div className="eyebrow px">SECTION 02 · SAVE POINT</div>
            <h2 className="px">SCHEDULE</h2>
            <div className="hand">pencilled in — subject to vibes</div>
        </div>

        <div className="notebook">
            <div className="rings">
                {Array.from({ length: 8 }, (_, i) => (
                    <i key={i} />
                ))}
            </div>
            <Page side="left" title="DAY 1 — SAT" items={DAY_1} tilt="-0.5deg" />
            <Page side="right" title="DAY 2 — SUN" items={DAY_2} tilt="0.4deg">
                <div className="pencil" />
            </Page>
        </div>

        <div className="sched-margin" style={{ right: -8, top: -40 }}>
            <Sticker tilt="8deg">
                <img
                    className="cutout"
                    src="/f26/sched-penguin-headphones.webp"
                    alt="penguin with headphones"
                    style={{ width: 130 }}
                />
            </Sticker>
        </div>
        <div className="sched-margin" style={{ left: -10, bottom: -30 }}>
            <Sticker tilt="-8deg">
                <img
                    className="cutout"
                    src="/f26/cow.webp"
                    alt="pink cow sticker"
                    style={{ width: 150 }}
                />
            </Sticker>
        </div>
        <div className="sched-margin" style={{ right: 40, bottom: -70 }}>
            <Sticker tilt="5deg" float>
                <img
                    src="/f26/sched-mascot.webp"
                    alt="student mascot with penguin"
                    style={{
                        width: 200,
                        filter: "drop-shadow(0 10px 18px rgba(0,0,0,.5))",
                    }}
                />
            </Sticker>
        </div>
        <div className="sched-margin" style={{ left: "44%", bottom: -90 }}>
            <Sticker tilt="12deg">
                <img
                    className="doodle"
                    src="/f26/doodle-cat-2.webp"
                    alt="cat doodle in a tie"
                    style={{ width: 110 }}
                />
            </Sticker>
        </div>
    </section>
);

export default Schedule;
