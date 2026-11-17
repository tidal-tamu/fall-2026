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

function Keyboard() {
    return <>
        <path d="M100 84c0-28 40-20 34-58" fill="none" stroke="#7fa7c4" strokeWidth="6" strokeLinecap="round" />
        <rect x="16" y="84" width="168" height="82" rx="14" fill="#dfe7ee" {...outline} />
        {Array.from({ length: 27 }, (_, index) => {
            const row = Math.floor(index / 9);
            const column = index % 9;
            return <rect key={index} x={28 + column * 16.3} y={96 + row * 16}
                width="12.5" height="12" rx="3" fill={row === 1 && column === 4 ? "#efd3b8" : "#fbfdff"}
                stroke={INK} strokeWidth="1.6" />;
        })}
        <rect x="62" y="146" width="76" height="11" rx="3" fill="#fbfdff" stroke={INK} strokeWidth="1.6" />
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

const illustrations = [Television, Creami, Keyboard, Lego, MysteryPrize];

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
