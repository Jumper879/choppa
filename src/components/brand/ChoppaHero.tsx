export function ChoppaHero({
  size = 220,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 210"
      width={size}
      height={size * (210 / 160)}
      className={className}
      role="img"
      aria-label="Choppa mascot"
    >
      {/* back limbs (swing opposite to front limbs) */}
      <g className="choppa-limb-a choppa-limb-shoulder">
        <rect x="66" y="84" width="14" height="40" rx="7" fill="currentColor" />
      </g>
      <g className="choppa-limb-b choppa-limb-hip">
        <rect x="73" y="118" width="16" height="52" rx="8" fill="currentColor" />
        <rect x="68" y="164" width="26" height="10" rx="5" fill="currentColor" />
      </g>

      {/* front limbs */}
      <g className="choppa-limb-b choppa-limb-shoulder">
        <rect x="80" y="84" width="14" height="40" rx="7" fill="currentColor" />
        <path
          d="M85 118 h20 a4 4 0 0 1 4 4.6 l-3 20 a5 5 0 0 1-5 4.4 h-12 a5 5 0 0 1-5-4.4 l-3-20 a4 4 0 0 1 4-4.6 Z"
          fill="currentColor"
        />
        <path d="M92 118 v-6 a5 5 0 0 1 10 0 v6" stroke="currentColor" strokeWidth="3" fill="none" />
      </g>
      <g className="choppa-limb-a choppa-limb-hip">
        <rect x="73" y="118" width="16" height="52" rx="8" fill="currentColor" />
        <rect x="68" y="164" width="26" height="10" rx="5" fill="currentColor" />
      </g>

      {/* body bob */}
      <g className="animate-choppa-bob">
        <rect x="64" y="74" width="32" height="48" rx="13" fill="currentColor" transform="rotate(-4 80 98)" />

        {/* head + propeller */}
        <rect x="60" y="42" width="40" height="34" rx="8" fill="currentColor" />
        <rect x="77" y="30" width="6" height="15" rx="3" fill="currentColor" />
        <g className="choppa-propeller">
          <ellipse cx="80" cy="26" rx="34" ry="8" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <circle cx="80" cy="26" r="4.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
