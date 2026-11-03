import type { Config } from "tailwindcss";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                pixel: ['"Press Start 2P"', "monospace"],
                mono: ['"Space Mono"', "ui-monospace", "monospace"],
                gameMono: ['"Space Mono"', "monospace"],
                grotesk: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
                // dot-matrix numerals for the CD-player LCD bits
                lcd: ['"Doto"', '"Space Mono"', "monospace"],
                // editorial serif for the glass and paper hero explorations
                display: ['"Instrument Serif"', "Georgia", "serif"],
            },
            colors: {
                game: {
                    ink: "#333f48", muted: "#53616b", penguin: "#44515a",
                    cream: "#f9e4cf", window: "#fbfdff", sky: "#e3edf6",
                    blue: "#c6d8e2", pastel: "#bfd2dd", shadow: "#a2b8c6",
                    light: "#f1f7fb", sage: "#cdd8cb", peach: "#efd3b8",
                    heart: "#7fa7c4", dark: "#26313a",
                },
                /* Monochrome Y2K. Never pure black — #111110 reads warmer and
                   avoids the flat, over-contrasted look of #000 on #fff. */
                ink: "#111110",
                paper: "#FFFFFF",
                mid: "#6B6862",
                dim: "#A3A099",
                rule: "rgba(17,17,16,0.14)",
                shade: {
                    100: "#F4F3F1",
                    200: "#E4E2DD",
                    300: "#CFCCC5",
                    400: "#ADAAA2",
                    500: "#85827A",
                    600: "#5C5A54",
                    700: "#383632",
                },
                /* The theme pitch's one allowed accent: a cold blue hint.
                   Used sparingly (links, LCD glow, the ticket stamp) so the
                   page still reads as monochrome. */
                hint: {
                    DEFAULT: "#8EA7C2",
                    deep: "#34506F",
                    wash: "#E6EBF0",
                },
            },
            letterSpacing: {
                label: "0.22em", // uppercase mono eyebrows
                tight: "-0.035em", // huge grotesk headlines
            },
            // Components select these browser-native animations with animate-* classes.
            // Keep the original keyframe names and timing values for visual parity.
            keyframes: {
                "caped-beat": {
                    "0%, 100%": {
                        "transform": "scale(1)"
                    },
                    "30%": {
                        "transform": "scale(1.25)"
                    },
                    "60%": {
                        "transform": "scale(0.95)"
                    }
                },
                "caped-twinkle": {
                    "0%, 100%": {
                        "transform": "scale(0.55) rotate(0deg)",
                        "opacity": "0.55"
                    },
                    "50%": {
                        "transform": "scale(1) rotate(20deg)",
                        "opacity": "1"
                    }
                },
                "caped-giant-in": {
                    "from": {
                        "opacity": "0"
                    },
                    "to": {
                        "opacity": "1"
                    }
                },
                "caped-blink": {
                    "0%, 92%, 100%": {
                        "transform": "scaleY(1)"
                    },
                    "94%": {
                        "transform": "scaleY(0.1)"
                    },
                    "96%": {
                        "transform": "scaleY(1)"
                    }
                },
                "caped-fade-in": {
                    "to": {
                        "opacity": "1"
                    }
                },
                "caped-flick": {
                    "0%, 100%": {
                        "opacity": "0.05"
                    },
                    "42%, 62%": {
                        "opacity": "1"
                    }
                },
                "caped-beacon": {
                    "0%, 100%": {
                        "opacity": "0.2"
                    },
                    "50%": {
                        "opacity": "1"
                    }
                },
                "caped-hero-breathe": {
                    "0%, 100%": {
                        "transform": "scale(1, 1)"
                    },
                    "50%": {
                        "transform": "scale(1.02, 1.04)"
                    }
                },
                "caped-wig": {
                    "from": {
                        "transform": "rotate(-9deg)"
                    },
                    "to": {
                        "transform": "rotate(9deg)"
                    }
                },
                "caped-spark-pop": {
                    "0%": {
                        "transform": "scale(0) rotate(0deg)"
                    },
                    "35%": {
                        "transform": "scale(var(--s)) rotate(45deg)"
                    },
                    "70%, 100%": {
                        "transform": "scale(0) rotate(90deg)"
                    }
                },
                "caped-rise": {
                    "to": {
                        "opacity": "1",
                        "filter": "blur(0)",
                        "transform": "none"
                    }
                },
                "caped-drift": {
                    "from": {
                        "transform": "translateX(-440px)"
                    },
                    "to": {
                        "transform": "translateX(calc(100vw + 40px))"
                    }
                },
                "caped-fly": {
                    "from": {
                        "transform": "translate(-20vw, calc(var(--H) * .30)) rotate(-7deg)"
                    },
                    "to": {
                        "transform": "translate(115vw, calc(var(--H) * .09)) rotate(-7deg)"
                    }
                },
                "byte-starTw": {
                    "0%, 100%": {
                        "opacity": ".3"
                    },
                    "50%": {
                        "opacity": "1"
                    }
                },
                "byte-wCape": {
                    "from": {
                        "transform": "skewX(0deg)"
                    },
                    "to": {
                        "transform": "skewX(-10deg) scaleX(1.06)"
                    }
                },
                "byte-blinkTxt": {
                    "50%": {
                        "opacity": ".25"
                    }
                },
                "byte-idle": {
                    "0%, 100%": {
                        "transform": "translateX(-50%) scale(1, 1)"
                    },
                    "50%": {
                        "transform": "translateX(-50%) scale(1.012, 1.03)"
                    }
                },
                "byte-capeIdle": {
                    "from": {
                        "transform": "skewX(0deg)"
                    },
                    "to": {
                        "transform": "skewX(6deg) scaleX(1.04)"
                    }
                },
                "byte-hop": {
                    "50%": {
                        "translate": "0 -6px"
                    }
                },
                "byte-nudgeR": {
                    "50%": {
                        "translate": "3px -50%"
                    }
                },
                "byte-pop": {
                    "from": {
                        "opacity": "0",
                        "transform": "translateY(18px) scale(.97)"
                    },
                    "to": {
                        "opacity": "1",
                        "transform": "none"
                    }
                },
                "byte-float": {
                    "0%, 100%": {
                        "translate": "0 0"
                    },
                    "50%": {
                        "translate": "0 -8px"
                    }
                },
                "byte-shine": {
                    "to": {
                        "transform": "translateX(100%)"
                    }
                },
                "byte-caret": {
                    "50%": {
                        "opacity": "0"
                    }
                },
                "byte-drift": {
                    "from": {
                        "transform": "translateX(-440px)"
                    },
                    "to": {
                        "transform": "translateX(calc(100vw + 40px))"
                    }
                },
                "byte-blink": {
                    "0%, 92%, 100%": {
                        "transform": "scaleY(1)"
                    },
                    "94%": {
                        "transform": "scaleY(.1)"
                    },
                    "96%": {
                        "transform": "scaleY(1)"
                    }
                },
                "sponsor-marquee": {
                    "to": {
                        "transform": "translateX(-50%)"
                    }
                },

                blink: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                "marquee-scroll": {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            animation: {
                "hero-heartbeat": "caped-beat 0.8s ease-in-out infinite",
                "hero-twinkle": "caped-twinkle 4s ease-in-out infinite",
                "hero-giant": "caped-giant-in 2.4s cubic-bezier(0.16, 1, 0.3, 1) both",
                "hero-blink": "caped-blink 7.5s infinite",
                "hero-fog": "caped-fade-in 2.2s 0.4s ease-out both",
                "city-window": "caped-flick 6s ease-in-out infinite",
                "city-beacon": "caped-beacon 2.8s ease-in-out infinite",
                "hero-breathe": "caped-hero-breathe 3.6s ease-in-out infinite",
                "hero-fish": "caped-wig 0.42s ease-in-out infinite alternate",
                "hero-spark": "caped-spark-pop 1.5s cubic-bezier(0.16, 1, 0.3, 1) var(--dl) infinite",
                "hero-letter": "caped-rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) calc(0.35s + var(--i) * 45ms) forwards",
                "hero-reveal": "caped-rise 1.1s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s) forwards",
                "hero-cloud": "caped-drift var(--cloud-duration) var(--cloud-delay) linear infinite",
                "hero-plane": "caped-fly 80s -22s linear infinite",
                "star-twinkle": "byte-starTw 3.2s ease-in-out infinite",
                "walking-cape": "byte-wCape .32s ease-in-out infinite alternate",
                "player-label": "byte-blinkTxt 1.3s steps(1) infinite",
                "press-start": "byte-blinkTxt 1.1s steps(1) infinite",
                "pebble-idle": "byte-idle 3.4s ease-in-out infinite",
                "pebble-cape": "byte-capeIdle 1.8s ease-in-out infinite alternate",
                "pebble-blink": "byte-blink 5.2s infinite",
                "walker-blink": "byte-blink 4.6s infinite",
                "quest-hop": "byte-hop 1s ease-in-out infinite",
                "quest-pointer": "byte-nudgeR .6s ease-in-out infinite",
                "dialog-open": "byte-pop .45s cubic-bezier(.16,1,.3,1)",
                "prize-float": "byte-float 4s ease-in-out infinite",
                "prize-shine": "byte-shine .8s ease",
                "caret": "byte-caret .8s steps(1) infinite",
                "sky-cloud": "byte-drift linear infinite",
                "sponsor-marquee": "sponsor-marquee 34s linear infinite",

                blink: "blink 1s step-end infinite",
                "marquee-scroll": "marquee-scroll 30s linear infinite",
            },
        },
    },
    plugins: [],
} satisfies Config;
