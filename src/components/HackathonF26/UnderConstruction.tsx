import { LINKS } from "./event";

export default function UnderConstruction() {
    return (
        <section id="under-construction" className="caped-construction" aria-labelledby="construction-title">
            <div className="caped-construction__scaffold" aria-hidden="true" />
            <div className="caped-construction__inner">
                <div className="caped-construction__copy">
                    <p className="caped-construction__eyebrow">MORE ADVENTURES AHEAD</p>
                    <h2 id="construction-title">
                        under
                        <span className="caped-construction__word">
                            construction<span className="caped-construction__cursor" aria-hidden="true">_</span>
                        </span>
                    </h2>
                    <p className="caped-construction__description">
                        The rest of the tidalBYTE &apos;26 site is on its way. Check back soon for more event details.
                    </p>
                    <a className="caped-construction__contact" href={`mailto:${LINKS.email}`}>
                        QUESTIONS? EMAIL US <span aria-hidden="true">↗</span>
                    </a>
                </div>
                <img className="caped-construction__mascot" src="/f26/pebble-caped.png" alt="" aria-hidden="true" loading="lazy" />
            </div>
            <div className="caped-construction__road" aria-hidden="true" />
        </section>
    );
}
