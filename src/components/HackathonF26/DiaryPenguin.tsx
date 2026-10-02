/* -------------------------------------------------------------------------- */
/*  The walker from the Summer Diary reference, as the crew's penguin: bucket  */
/*  hat, backpack, eyes on its phone, mid-stride along the sidewalk. Drawn in  */
/*  the reference's line-art manner, a thin slate outline over flat muted      */
/*  fills. The feet are their own groups so the CSS can step them.             */
/* -------------------------------------------------------------------------- */

const LINE = "#33404c";
const BODY = "#3d4a57";
const BELLY = "#f3f5f7";
const HAT = "#c7d4e0";
const FEET = "#a9b9c9";

const DiaryPenguin = () => (
    <svg viewBox="0 0 220 300" className="diary-penguin__svg" aria-hidden="true">
        <ellipse cx="112" cy="290" rx="64" ry="7" fill="rgba(51, 64, 76, 0.16)" />

        <g stroke={LINE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
            <ellipse className="diary-penguin__foot diary-penguin__foot--back" cx="134" cy="279" rx="22" ry="9" fill={FEET} />
            <ellipse className="diary-penguin__foot diary-penguin__foot--front" cx="84" cy="282" rx="24" ry="9" fill={FEET} />

            {/* backpack, slung behind */}
            <rect x="146" y="128" width="56" height="100" rx="20" fill="#3a4754" />
            <rect x="155" y="176" width="38" height="34" rx="10" fill="#4a5867" strokeWidth="2" />
            <path d="M203 148 V160" strokeWidth="2" />
            <circle cx="203" cy="166" r="6" fill="#cfdeee" strokeWidth="2" />

            {/* body, belly, face */}
            <path
                d="M106 70 C 150 70, 170 120, 172 176 C 174 236, 146 272, 106 272 C 66 272, 38 236, 40 176 C 42 120, 62 70, 106 70 Z"
                fill={BODY}
            />
            <path
                d="M84 132 C 112 132, 128 168, 128 206 C 128 246, 110 266, 86 266 C 62 266, 50 242, 50 206 C 50 166, 60 132, 84 132 Z"
                fill={BELLY}
                strokeWidth="2"
            />
            <ellipse cx="80" cy="117" rx="30" ry="25" fill={BELLY} strokeWidth="2" />
            <ellipse cx="70" cy="119" rx="3.6" ry="4.6" fill={LINE} stroke="none" />
            <ellipse cx="62" cy="133" rx="8" ry="4.5" fill="#cfdeee" stroke="none" />
            <path d="M54 122 C 46 124, 40 128, 37 134 C 45 135, 52 133, 58 130 Z" fill={FEET} strokeWidth="2" />

            {/* strap over the shoulder, then the far flipper */}
            <path d="M146 132 C 136 150, 132 176, 136 208" stroke="#2a333c" strokeWidth="9" fill="none" />
            <path d="M166 178 C 178 192, 182 210, 178 224 C 170 214, 164 200, 162 186 Z" fill={BODY} />

            {/* near flipper holding the phone up */}
            <path d="M62 160 C 46 168, 36 186, 38 204 C 50 198, 60 186, 68 172 Z" fill={BODY} />
            <g transform="rotate(-16 38 168)">
                <rect x="27" y="150" width="22" height="35" rx="4" fill={LINE} />
                <rect x="30" y="154" width="16" height="25" rx="2" fill="#e3ecf6" stroke="none" />
            </g>

            {/* bucket hat */}
            <path d="M68 98 C 66 62, 146 58, 148 96 Z" fill={HAT} />
            <path d="M70 94 C 96 88, 124 87, 148 92" fill="none" strokeWidth="2" />
            <path
                d="M46 100 C 70 88, 150 86, 170 100 C 172 108, 160 112, 148 109 C 118 103, 88 104, 62 110 C 50 113, 42 106, 46 100 Z"
                fill={HAT}
            />
        </g>
    </svg>
);

export default DiaryPenguin;
