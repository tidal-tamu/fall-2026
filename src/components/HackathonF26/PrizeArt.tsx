const INK = "#333f48";
const outline = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;

function Television() {
    return <>
        <path d="M66 152l-9 23m77-23 9 23" fill="none" {...outline} />
        <rect x="18" y="38" width="164" height="116" rx="14" fill="#dfe7ee" {...outline} />
        <rect x="28" y="48" width="144" height="94" rx="7" fill={INK} />
        <rect x="34" y="54" width="132" height="82" rx="4" fill="#b4cadb" />
        <circle cx="132" cy="76" r="11" fill="#f9e4cf" />
        <path d="M34 119l34-31 30 25 27-18 41 32v9H34z" fill="#7fa7c4" />
        <path d="M43 65h39" stroke="#fbfdff" strokeWidth="4" strokeLinecap="round" opacity=".65" />
        <circle cx="100" cy="148" r="2" fill={INK} />
    </>;
}

function Creami() {
    return <>
        <rect x="52" y="24" width="96" height="154" rx="15" fill="#dfe7ee" {...outline} />
        <rect x="62" y="35" width="76" height="38" rx="7" fill={INK} />
        <circle cx="100" cy="54" r="9" fill="#cdd8cb" />
        <path d="M68 88h64v65H68z" fill={INK} {...outline} />
        <path d="M78 100h44l-4 49H82z" fill="#f9e4cf" {...outline} />
        <path d="M122 107h10v24h-12" fill="none" {...outline} />
        <rect x="66" y="158" width="68" height="10" rx="4" fill="#b4cadb" />
    </>;
}

function Projector() {
    return <>
        <path d="M139 89l49-28v92l-49-22z" fill="#f9e4cf" opacity=".6" />
        <path d="M48 146v16m88-16v16" {...outline} />
        <rect x="22" y="70" width="146" height="80" rx="16" fill="#dfe7ee" {...outline} />
        <circle cx="125" cy="109" r="28" fill={INK} {...outline} />
        <circle cx="125" cy="109" r="19" fill="#7fa7c4" />
        <circle cx="119" cy="102" r="6" fill="#fbfdff" />
        <path d="M38 96h39m-39 12h39m-39 12h39" {...outline} />
        <circle cx="47" cy="81" r="3" fill="#cdd8cb" />
    </>;
}

function Lego() {
    return <>
        <rect x="26" y="105" width="112" height="62" rx="5" fill="#efd3b8" {...outline} />
        {[42, 78, 114].map(x => <rect key={x} x={x} y="95" width="18" height="14" rx="3" fill="#f9e4cf" {...outline} />)}
        <rect x="76" y="55" width="98" height="44" rx="5" fill="#b4cadb" {...outline} />
        {[90, 126, 150].map(x => <rect key={x} x={x} y="44" width="16" height="14" rx="3" fill="#dfe7ee" {...outline} />)}
        <path d="M39 154h85m-34-68h70" stroke={INK} strokeWidth="2" opacity=".3" />
    </>;
}

function MysteryPrize() {
    return <>
        <path d="M100 58C52 58 51 18 72 24c18 5 28 34 28 34Zm0 0c48 0 49-40 28-34-18 5-28 34-28 34Z" fill="#d9d6e3" {...outline} />
        <rect x="37" y="78" width="126" height="97" rx="6" fill="#f9e4cf" {...outline} />
        <rect x="29" y="58" width="142" height="29" rx="5" fill="#efd3b8" {...outline} />
        <path d="M100 59v28" {...outline} />
        <path d="M87 116c0-17 28-17 28 0 0 10-15 10-15 21" fill="none" {...outline} />
        <circle cx="100" cy="149" r="3" fill={INK} />
    </>;
}

const illustrations = [Television, Creami, Projector, Lego, MysteryPrize];

export default function PrizeArt({ index, label, className }: {
    className?: string;
    index: number;
    label?: string;
}) {
    const Illustration = illustrations[index];
    return <svg className={className} viewBox="0 0 200 200" role={label ? "img" : undefined}
        aria-label={label} aria-hidden={label ? undefined : true}>
        <ellipse cx="100" cy="186" rx="74" ry="9" fill="rgba(51,63,72,.1)" />
        <Illustration />
    </svg>;
}
