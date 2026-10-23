import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import LinerNotes from "./LinerNotes";
import start from "./byte/level-start.html?raw";
import end from "./byte/level-end.html?raw";
import overlay from "./byte/level-overlay.html?raw";
import { mountLevel } from "./byte/level-runtime.js";
import "./byte/level.css";

// The supplied page's level is kept together; its CSS stays scoped so the
// existing React hero retains its appearance and animation behavior.
export default function ByteLevel() {
    const root = useRef<HTMLDivElement>(null);
    const overlayRoot = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (root.current && overlayRoot.current) return mountLevel(root.current, overlayRoot.current);
    }, []);

    return (
        <>
            <main ref={root} className="byte-site">
                <div dangerouslySetInnerHTML={{ __html: start }} />
                <LinerNotes />
                <div dangerouslySetInnerHTML={{ __html: end }} />
            </main>
            {createPortal(
                <div ref={overlayRoot} className="byte-site byte-overlay"
                    dangerouslySetInnerHTML={{ __html: overlay }} />,
                document.body,
            )}
        </>
    );
}
