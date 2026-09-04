import type { ReactNode } from "react";

const MARQUEE =
  "★ YEEHAW ★ WELCOME TO THE KNIPE FAMILY RANCH ★ YOU ARE VISITOR № 000137 ★ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 ★ NOW PLAYING: GHOST RIDERS IN THE SKY.MID ★ NO POP-UPS (YET) ★ PLEASE SIGN THE GUESTBOOK ★";

function visitorNumber() {
  const days = Math.floor(Date.now() / 86_400_000);
  return String(137 + (days % 8642)).padStart(6, "0");
}

export function RanchFrame({
  children,
  compact,
}: {
  children: ReactNode;
  compact?: boolean;
}) {
  const digits = visitorNumber().split("");

  return (
    <div className="ranch-shell">
      <div className="ranch-marquee" aria-hidden>
        <div className="ranch-marquee-track">
          <span>{MARQUEE}</span>
          <span>{MARQUEE}</span>
        </div>
      </div>
      <div className={`ranch-page ${compact ? "justify-center" : ""}`}>
        {children}
        <footer className="ranch-footer">
          <p className="construction mb-3">
            <span className="blink">⚠ UNDER CONSTRUCTION ⚠ MORE TOOLS RIDING IN SOON</span>
          </p>
          <p className="now-playing justify-center text-sm">
            <span className="eq-bar" aria-hidden>
              <span style={{ height: "40%" }} />
              <span style={{ height: "90%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "75%" }} />
            </span>
            now playing: ghost_riders.mid
          </p>
          <p className="mt-3 font-pixel text-lg text-[#2b1408]">
            You are visitor{" "}
            <span className="hit-counter" aria-label={`Visitor number ${digits.join("")}`}>
              {digits.map((digit, index) => (
                <i key={`${digit}-${index}`}>{digit}</i>
              ))}
            </span>
          </p>
          <p className="webring">
            ← previous homestead ·{" "}
            <span className="rainbow font-bold">family webring</span> · next ranch →
          </p>
          <p className="mt-2 font-comic text-sm text-(--muted)">
            this page is maintained with a lasso and a dream · knipe.io © 1998–forever
          </p>
        </footer>
      </div>
      <div className="tumbleweed" aria-hidden>
        <svg height="52" viewBox="0 0 32 32" width="52">
          <circle
            cx="16"
            cy="16"
            fill="#c4a574"
            fillOpacity="0.35"
            r="12"
            stroke="#3d1f0a"
            strokeWidth="2"
          />
          <path
            d="M16 4 C10 10 10 22 16 28 C22 22 22 10 16 4 M4 16 C10 10 22 10 28 16 C22 22 10 22 4 16 M8 8 C16 12 16 20 24 24 M24 8 C16 12 16 20 8 24"
            fill="none"
            stroke="#5c3317"
            strokeWidth="1.6"
          />
        </svg>
      </div>
      <div className="fence" aria-hidden />
    </div>
  );
}
