import { ReactNode } from "react";

interface SectionHeaderProps {
    track: string;
    file: string;
    title: ReactNode;
    dek?: ReactNode;
    className?: string;
}

/* Magazine folio + oversized grotesk headline. Every section opens with one,
   so the page reads like an album's liner notes: TRACK 03 · schedule.rcpt */
const SectionHeader = ({ track, file, title, dek, className = "" }: SectionHeaderProps) => (
    <header className={className}>
        <div className="folio">
            <span className="label text-ink">TRACK {track}</span>
            <span className="folio__rule" aria-hidden="true" />
            <span className="label text-mid normal-case tracking-[0.08em]">{file}</span>
        </div>
        <h2 className="headline mt-6">{title}</h2>
        {dek && <p className="dek mt-5">{dek}</p>}
    </header>
);

export default SectionHeader;
