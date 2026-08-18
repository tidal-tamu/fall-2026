import { useCoins } from "./coinEconomy";

/* Fixed right-side tray holding every sticker won from the gacha. */

const StickerTray = () => {
    const { collected } = useCoins();
    if (!collected.length) return null;
    return (
        <div className="tray">
            <span className="tlabel px">COLLECTED</span>
            {collected.map((src, i) => (
                <img key={`${src}-${i}`} src={src} alt="collected sticker" />
            ))}
        </div>
    );
};

export default StickerTray;
