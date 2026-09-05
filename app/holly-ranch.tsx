const HEARTS = [1, 2, 3, 4, 5, 6, 7] as const;

export function HollyRanch() {
  return (
    <div className="holly-ranch" aria-hidden>
      <div className="holly-hearts">
        {HEARTS.map((heart) => (
          <span className="holly-heart" key={heart}>
            ♥
          </span>
        ))}
      </div>
      <div className="holly-flip">
        <div className="holly-wink-wrap">
          <img
            alt=""
            className="holly-figure"
            height={753}
            src="/holly-cowgirl.png"
            width={380}
          />
          <img
            alt=""
            className="holly-figure holly-wink"
            height={753}
            src="/holly-wink.png"
            width={380}
          />
        </div>
      </div>
    </div>
  );
}
