import { cn, ui, headingStyle } from "./ui";
import { EVENT, fmtCentral } from "./event";
import PixelCanvas from "./PixelArt";

export default function Register() {
    const eventDay = fmtCentral(EVENT.startsAt, { month: "short", day: "numeric" }).toLowerCase();
    return (
        <footer id="register" className={cn(
            ui.section,
            "end pt-[120px] pb-[130px]",
        )}>
            <div className={ui.wrap}>
                <div className={cn(
                    "end-grid gap-[50px] grid [grid-template-columns:1fr_minmax(0,_420px)] items-center",
                    "max-[900px]:grid-cols-1",
                )}>
                    <div>
                        <div className={cn(
                            ui.stage,
                            "[transition:color_.8s_ease,_border-color_.8s_ease] group-[.is-night]/level:text-[#c6d4de]",
                        )}><b className={cn(
                            "px-[9px] whitespace-nowrap font-normal bg-game-ink text-game-light pt-[7px] pb-1.5",
                            "rounded-[5px] group-[.is-night]/level:bg-[#e6eef4] group-[.is-night]/level:text-game-dark",
                        )}>FINAL STAGE</b> save point</div>
                        <h2 className={ui.heading} style={headingStyle}>see you {eventDay}</h2>
                        <p className={cn(
                            ui.intro,
                            "group-[.is-night]/level:text-[#c6d4de] m-0 [transition:color_.8s_ease,_border-color_.8s_ease]",
                        )}>{EVENT.registrationOpen ? "registration is open." : "registration opens soon."} save your spot, follow tidal on instagram, and tell a friend who's never been to a hackathon — this one's for them.</p>
                        <span className={cn(
                            "press block mt-[26px] font-pixel text-[10px] text-game-muted",
                            "animate-press-start",
                            "[transition:color_.8s_ease,_border-color_.8s_ease] group-[.is-night]/level:text-[#c6d4de]",
                        )} aria-hidden="true">PRESS START</span>
                        <a
                            className={cn(
                                ui.button,
                                "mt-4",
                            )}
                            href={EVENT.registerUrl}
                            aria-disabled={!EVENT.registrationOpen}
                            onClick={event => {
                                if (!EVENT.registrationOpen)
                                    event.preventDefault();
                            }}
                        >
                            {EVENT.registrationOpen ? "REGISTER" : "OPENS SOON"}
                            <svg className="w-5 h-5" viewBox="0 0 7 7" aria-hidden="true" style={{ width: 14, height: 14 }}>
                                <path fill="#6f98b8" d="M1 0h2v1h1V0h2v1h1v3h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1V4H0V1h1z" />
                            </svg>
                        </a>
                    </div>
                    <div className="pc relative z-[2] max-[900px]:max-w-[380px]" aria-hidden="true">
                        <svg className="block w-full h-auto overflow-visible" viewBox="0 0 420 330">
                            <rect
                                x="40"
                                y="276"
                                width="350"
                                height="22"
                                rx="8"
                                fill="#c6d8e2"
                                stroke="#333f48"
                                strokeWidth="3"
                            />
                            <rect
                                x="70"
                                y="20"
                                width="250"
                                height="210"
                                rx="22"
                                fill="#dfe7ee"
                                stroke="#333f48"
                                strokeWidth="3"
                            />
                            <rect
                                x="94"
                                y="42"
                                width="202"
                                height="136"
                                rx="10"
                                fill="#44515a"
                                stroke="#333f48"
                                strokeWidth="3"
                            />
                            <circle cx="270" cy="204" r="7" fill="#f2c9a0" stroke="#333f48" strokeWidth="2" />
                            <path d="M110 204 h80" stroke="#9fb1be" strokeWidth="4" strokeLinecap="round" />
                            <path d="M160 230 v24 h70 v-24" fill="#c6d8e2" stroke="#333f48" strokeWidth="3" />
                            <rect
                                x="120"
                                y="252"
                                width="190"
                                height="28"
                                rx="8"
                                fill="#fbfdff"
                                stroke="#333f48"
                                strokeWidth="3"
                            />
                            <path
                                d="M138 262 h12 M158 262 h12 M178 262 h12 M198 262 h12 M218 262 h12 M238 262 h12 M258 262 h12 M278 262 h12 M150 271 h120"
                                stroke="#9fb1be"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            <path d="M330 284 q22 -34 4 -60" fill="none" stroke="#333f48" strokeWidth="3" />
                            <ellipse cx="338" cy="222" rx="14" ry="10" fill="#fbfdff" stroke="#333f48" strokeWidth="3" />
                        </svg>
                        <PixelCanvas className="absolute [image-rendering:crisp-edges] rounded-md"
                            scene="pc"
                            width={64}
                            height={44}
                            style={{ left: "22.4%", top: "12.7%", width: "48.1%", height: "41.2%" }}
                        />
                    </div>
                </div>
                <div className={cn(
                    "fine gap-3 relative z-[2] mt-20 flex flex-wrap justify-between text-[12px] text-[#6f7f8b]",
                    "[border-top-width:2px] [border-top-style:dashed] [border-top-color:#c9d6df] pt-[22px]",
                    "[transition:color_.8s_ease,_border-color_.8s_ease] group-[.is-night]/level:text-[#9fb1be] group-[.is-night]/level:[border-top-color:#4a5864]",
                )}>
                    <span>© 2026 tidal · texas a&amp;m</span>
                    <span>made with ♥, a fish, and too much lofi</span>
                </div>
            </div>
        </footer>
    );
}
