// Portrait cropped from Wikimedia Commons: Suze Randall, 2009,
// photo by Glenn Francis (CC BY-SA).

export function SuzeBob({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={`bounce-slow inline-block align-middle ${size === "lg" ? "mb-1" : "mr-2"}`}
    >
      <img
        alt=""
        className={size === "lg" ? "suze-bob suze-bob-lg" : "suze-bob"}
        height={348}
        src="/suze-cowboy.png"
        width={280}
      />
    </span>
  );
}
