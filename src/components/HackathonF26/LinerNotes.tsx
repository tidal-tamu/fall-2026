import { sponsors } from "./Sponsors";
import { LINKS } from "./event";

const SPONSOR_MAIL =
    `mailto:${LINKS.email}?subject=` + encodeURIComponent("Sponsoring tidalBYTE '26");

export default function LinerNotes() {
    return (
        <section id="sponsors" className="caped-sponsors" aria-labelledby="sponsors-title">
            <div className="caped-sponsors__inner">
                <header className="caped-sponsors__head">
                    <p className="caped-sponsors__eyebrow">THE HEROES BEHIND THE HERO</p>
                    <h2 id="sponsors-title">powered by</h2>
                    <p>Thanks to the sponsors helping make tidalBYTE &apos;26 possible.</p>
                </header>

                <ul className="caped-sponsors__grid" aria-label="Sponsors">
                    {sponsors.map((sponsor) => (
                        <li key={sponsor.name} className="caped-sponsors__window">
                            <img src={sponsor.logo} alt={sponsor.name} loading="lazy" decoding="async" />
                        </li>
                    ))}
                </ul>

                <div className="caped-sponsors__invite">
                    <div>
                        <p className="caped-sponsors__eyebrow">THERE&apos;S ROOM FOR ONE MORE</p>
                        <p className="caped-sponsors__invite-title">Want your logo up here?</p>
                    </div>
                    <a href={SPONSOR_MAIL}>SPONSOR TIDALBYTE <span aria-hidden="true">↗</span></a>
                </div>
            </div>
        </section>
    );
}
