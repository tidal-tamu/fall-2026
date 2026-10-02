import { EVENT } from "./event";

/* -------------------------------------------------------------------------- */
/*  The hero's register sticker: a dark slate pill with a white die-cut ring.  */
/*  It links out on its own once event.ts has registrationOpen and a           */
/*  registerUrl; until then it wears a "soon!" tag and stays inert.            */
/* -------------------------------------------------------------------------- */

const LIVE = EVENT.registrationOpen && Boolean(EVENT.registerUrl);

const RegisterButton = ({ className = "" }: { className?: string }) =>
    LIVE ? (
        <a
            href={EVENT.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`register-btn ${className}`}
        >
            REGISTER <span aria-hidden="true">→</span>
        </a>
    ) : (
        <span
            className={`register-btn register-btn--soon ${className}`}
            aria-disabled="true"
            title="Registration opens soon"
        >
            REGISTER
            <span className="register-btn__tag" aria-hidden="true">
                soon!
            </span>
            <span className="sr-only">(registration opens soon)</span>
        </span>
    );

export default RegisterButton;
