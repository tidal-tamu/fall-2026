import { useState } from "react";
import { FaDiscord, FaEnvelope, FaShareSquare, FaUserPlus } from "react-icons/fa";
import SectionHeader from "./SectionHeader";
import { EVENT, LINKS, STICKER } from "./event";

/* -------------------------------------------------------------------------- */
/*  About, as tidalBYTE's MySpace profile (theme pitch: "early blogspot /      */
/*  MySpace minimal"). The Top 8 is the mascot roster, in grayscale.           */
/* -------------------------------------------------------------------------- */

const TOP_8 = [
    { name: "pebble", img: "pebble-headphones" },
    { name: "lil pebble", img: "pebble-bow" },
    { name: "moo", img: "cow" },
    { name: "mochi", img: "cat" },
    { name: "prof. whiskers", img: "cat-prof" },
    { name: "dizzy", img: "panda" },
    { name: "bun", img: "bunny" },
];

const DETAILS: [string, string][] = [
    ["Status:", EVENT.registrationOpen ? "registration open!" : "registration opens soon"],
    ["Here for:", "building, learning, free food"],
    ["Date:", `${EVENT.day}, ${EVENT.date}`],
    ["Room:", EVENT.room],
    ["Length:", `${EVENT.hours} hours`],
    ["Teams:", "up to 4, or come solo"],
    ["Built for:", "freshmen & sophomores"],
    ["Experience:", "none needed"],
];

const INTERESTS: [string, string][] = [
    ["General:", "building things, free food, data science & AI/ML, side quests"],
    ["Music:", "whatever's on the aux at 2 PM"],
    ["Movies:", "Hackers (1995), The Social Network"],
    ["Heroes:", "first-time hackers"],
];

const COMMENTS = [
    { from: "pebble", img: "pebble-headphones", when: "11/14/2026 11:59 PM", text: "see u in MSC 2304 !! save me a snack" },
    { from: "bun", img: "bunny", when: "11/02/2026 4:12 PM", text: "thanks for the add :3" },
];

const SITE_URL = "https://f26.tidaltamu.com";

const About = () => {
    const [copied, setCopied] = useState(false);

    const share = async () => {
        try {
            if (navigator.share) {
                await navigator.share({ title: "tidalBYTE '26", url: SITE_URL });
                return;
            }
            await navigator.clipboard.writeText(SITE_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // share sheet dismissed, or clipboard blocked: nothing to do
        }
    };

    const contacts = [
        { label: "Send Message", icon: FaEnvelope, href: `mailto:${LINKS.email}` },
        { label: "Add to Friends", icon: FaUserPlus, href: LINKS.instagram },
        { label: "Instant Message", icon: FaDiscord, href: LINKS.discord },
    ];

    return (
        <section id="about" className="section">
            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    track="02"
                    file="about.html"
                    title="about"
                    dek="tidalBYTE's corner of the internet, best viewed at 1024×768."
                />

                <div className="space mt-14">
                    <div className="space__bar">
                        <span className="font-pixel text-[9px] md:text-[10px]">tidalspace</span>
                        <nav aria-label="Profile shortcuts" className="space__nav">
                            <a href="#top">home</a>
                            <a href="#invite">invite</a>
                            <a href="#schedule">schedule</a>
                            <a href="#prizes">prizes</a>
                            <a href="#faq">faq</a>
                        </nav>
                    </div>

                    <div className="space__body">
                        {/* ------------------------------------------ left -- */}
                        <div className="space-y-5">
                            <h3 className="space__name">tidalBYTE</h3>

                            <div className="flex gap-4">
                                <figure className="space__pic">
                                    <img
                                        src="/f26/pebble-loading.gif"
                                        alt="Pebble the penguin inside a loading window"
                                        width={339}
                                        height={203}
                                        loading="lazy"
                                    />
                                </figure>
                                <div className="space__vitals">
                                    <p className="italic">
                                        &ldquo;one room. twelve hours. zero experience needed.&rdquo;
                                    </p>
                                    <p>
                                        hackathon
                                        <br />
                                        {EVENT.hours} hours long
                                        <br />
                                        College Station,
                                        <br />
                                        TEXAS
                                    </p>
                                    <p className="space__online">
                                        <span className="space__dot" aria-hidden="true" />
                                        Online Now!
                                    </p>
                                </div>
                            </div>

                            <div className="space__small space-y-1">
                                <p>
                                    <b>Mood:</b> caffeinated (^_^)
                                </p>
                                <p>
                                    <b>View My:</b> <a href="#schedule">Schedule</a> |{" "}
                                    <a href="#prizes">Prizes</a>
                                </p>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">Contacting tidalBYTE</h4>
                                <div className="space__contact">
                                    {contacts.map(({ label, icon: Icon, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target={href.startsWith("mailto") ? undefined : "_blank"}
                                            rel="noopener noreferrer"
                                        >
                                            <Icon aria-hidden="true" /> {label}
                                        </a>
                                    ))}
                                    <button type="button" onClick={share}>
                                        <FaShareSquare aria-hidden="true" />{" "}
                                        {copied ? "Link copied!" : "Forward to Friend"}
                                    </button>
                                </div>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s URL</h4>
                                <p className="space__small px-3 py-2.5">{SITE_URL}</p>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s Details</h4>
                                <table className="space__details">
                                    <tbody>
                                        {DETAILS.map(([k, v]) => (
                                            <tr key={k}>
                                                <th scope="row">{k}</th>
                                                <td>{v}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s Interests</h4>
                                <table className="space__details">
                                    <tbody>
                                        {INTERESTS.map(([k, v]) => (
                                            <tr key={k}>
                                                <th scope="row">{k}</th>
                                                <td>{v}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ----------------------------------------- right -- */}
                        <div className="space-y-5">
                            <p className="space__network">
                                tidalBYTE is in your extended network
                            </p>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s Blurbs</h4>
                                <div className="space__blurb">
                                    <h5>About me:</h5>
                                    <p>
                                        tidalBYTE is TIDAL&apos;s fall hackathon at Texas A&amp;M:
                                        twelve hours in {EVENT.room} to build something with data
                                        science and AI/ML, or anything else you can dream up.
                                        It&apos;s built for freshmen and sophomores, so expect
                                        workshops, mentors on standby, free food, and prizes at the
                                        end. No experience needed. Just bring your curiosity and
                                        your laptop.
                                    </p>
                                    <h5>Who I&apos;d like to meet:</h5>
                                    <p>
                                        First-timers. People who have never opened a terminal and
                                        people who never close theirs. Designers, artists, data
                                        nerds, and anyone who wants to make something in a day.
                                        Bring a team of up to four, or come solo and we&apos;ll help
                                        you find one.
                                    </p>
                                </div>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s Friend Space</h4>
                                <p className="space__small px-3 pt-3 font-bold">
                                    tidalBYTE has <span className="text-hint-deep">8</span> friends.
                                </p>
                                <ul className="space__friends">
                                    {TOP_8.map((f) => (
                                        <li key={f.name}>
                                            <span className="space__friendname">{f.name}</span>
                                            <span className="space__friendpic">
                                                <img
                                                    src={STICKER(f.img)}
                                                    alt=""
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </span>
                                        </li>
                                    ))}
                                    <li>
                                        <span className="space__friendname">you?</span>
                                        <a href="#invite" className="space__friendpic space__friendpic--you">
                                            <span aria-hidden="true">?</span>
                                            <span className="sr-only">Your spot: see the invite</span>
                                        </a>
                                    </li>
                                </ul>
                                <p className="space__small px-3 pb-3 text-right">
                                    <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer">
                                        View All of tidalBYTE&apos;s Friends
                                    </a>
                                </p>
                            </div>

                            <div className="space__box">
                                <h4 className="space__boxhead">tidalBYTE&apos;s Friends Comments</h4>
                                <ul className="divide-y divide-rule">
                                    {COMMENTS.map((c) => (
                                        <li key={c.from} className="space__comment">
                                            <div className="space__commenter">
                                                <span className="space__friendname">{c.from}</span>
                                                <img src={STICKER(c.img)} alt="" loading="lazy" />
                                            </div>
                                            <div className="space__small">
                                                <p className="font-bold text-shade-600">{c.when}</p>
                                                <p className="mt-1.5">{c.text}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
