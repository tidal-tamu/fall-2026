import Sticker from "./Sticker";

/* Carnival booth: prize plushies sway from strings above a marquee counter. */

const PRIZES = [
    {
        place: "★ 1ST PLACE ★",
        amt: "$2,026 + bunny",
        img: "/f26/prize-bunny.webp",
        alt: "first place bunny plush",
        width: 120,
    },
    {
        place: "2ND PLACE",
        amt: "$1,000",
        img: "/f26/pebbleman.webp",
        alt: "second place penguin plush",
        width: 104,
    },
    {
        place: "3RD PLACE",
        amt: "$500",
        img: "/f26/pebblecute.webp",
        alt: "third place plush",
        width: 96,
    },
];

const Prizes = () => (
    <section id="prizes" style={{ textAlign: "center" }}>
        <div className="sec-head">
            <div className="eyebrow px">SECTION 03 · BONUS STAGE</div>
            <h2 className="px">PRIZES</h2>
            <div className="hand">step right up — winners pick from the wall</div>
        </div>

        <Sticker tilt="0deg">
            <div className="booth">
                <div className="booth-hang">
                    {PRIZES.map(({ place, amt, img, alt, width }) => (
                        <div className="hang" key={place}>
                            <img className="cutout" src={img} alt={alt} style={{ width }} />
                            <div className="place px">{place}</div>
                            <div className="amt">{amt}</div>
                        </div>
                    ))}
                </div>
                <div className="prize-counter">
                    <div className="px word">PRIZES</div>
                    <div className="bulbs">
                        {Array.from({ length: 12 }, (_, i) => (
                            <i key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </Sticker>
    </section>
);

export default Prizes;
