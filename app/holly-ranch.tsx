const BUBBLES = [1, 2, 3, 4, 5, 6, 7] as const;

export function HollyRanch() {
  return (
    <div className="holly-ranch" aria-hidden>
      <div className="holly-bubbles">
        {BUBBLES.map((bubble) => (
          <span className="holly-bubble" key={bubble} />
        ))}
      </div>
      <div className="holly-flip">
        <img
          alt=""
          className="holly-figure"
          height={792}
          src="/holly-cowgirl.png"
          width={380}
        />
      </div>
    </div>
  );
}
