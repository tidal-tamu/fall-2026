/* Sticky y2k marquee pinned to the top of the page. */

const TICKER_TEXT =
    "✦ TIDALbyte 2026 ✦ 24 HOURS ✦ REGISTER NOW ✦ PLUSHIE GACHA LIVE ✦ $8K IN PRIZES ✦ MIDNIGHT RAMEN ✦ ";

const Ticker = () => (
    <div className="ticker px">
        <div className="ticker-inner">
            {Array.from({ length: 6 }, (_, i) => (
                <span key={i}>{TICKER_TEXT}</span>
            ))}
        </div>
    </div>
);

export default Ticker;
