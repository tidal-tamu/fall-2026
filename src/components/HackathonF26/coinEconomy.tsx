import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
    ReactNode,
    RefObject,
} from "react";

/* Shared coin economy: the pac-man trail earns coins, the gacha machine
   spends them, and the tray keeps every sticker you win. Balance and
   collection live here; the flying-coin effect is imperative DOM since
   it's a fire-and-forget particle. */

const STARTING_BALANCE = 3;

interface CoinEconomy {
    balance: number;
    /** ref to attach to the HUD so flying coins know where to land */
    hudRef: RefObject<HTMLDivElement>;
    /** award 1 coin with a fly-to-HUD particle from a screen position */
    earnCoin: (clientX: number, clientY: number) => void;
    /** returns false if the balance can't cover it */
    spend: (amount: number) => boolean;
    collected: string[];
    collect: (src: string) => void;
}

const CoinContext = createContext<CoinEconomy | null>(null);

export const useCoins = () => {
    const ctx = useContext(CoinContext);
    if (!ctx) throw new Error("useCoins must be used inside CoinProvider");
    return ctx;
};

export const CoinProvider = ({ children }: { children: ReactNode }) => {
    const [balance, setBalance] = useState(STARTING_BALANCE);
    const [collected, setCollected] = useState<string[]>([]);
    const hudRef = useRef<HTMLDivElement>(null);

    const earnCoin = useCallback((clientX: number, clientY: number) => {
        const hud = hudRef.current?.getBoundingClientRect();
        if (hud) {
            const fly = document.createElement("div");
            fly.className = "flycoin";
            fly.style.left = `${clientX}px`;
            fly.style.top = `${clientY}px`;
            document.body.appendChild(fly);
            requestAnimationFrame(() => {
                const dx = hud.left + hud.width / 2 - clientX;
                const dy = hud.top + hud.height / 2 - clientY;
                fly.style.transform = `translate(${dx}px,${dy}px) scale(.3)`;
                fly.style.opacity = "0";
            });
            setTimeout(() => fly.remove(), 450);
        }
        setTimeout(() => setBalance((b) => b + 1), 400);
    }, []);

    const spend = useCallback((amount: number) => {
        let ok = false;
        setBalance((b) => {
            if (b < amount) return b;
            ok = true;
            return b - amount;
        });
        return ok;
    }, []);

    const collect = useCallback((src: string) => {
        setCollected((c) => [...c, src]);
    }, []);

    return (
        <CoinContext.Provider
            value={{ balance, hudRef, earnCoin, spend, collected, collect }}
        >
            {children}
        </CoinContext.Provider>
    );
};
