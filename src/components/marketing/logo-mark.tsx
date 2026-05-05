interface LogoMarkProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function LogoMark({ size = 26, className, ...rest }: LogoMarkProps) {
  const hidden = rest["aria-hidden"];
  // When the logo is decorative (e.g. next to the wordmark), hide it from
  // assistive tech entirely so the link's accessible name isn't doubled.
  const a11yProps = hidden
    ? { "aria-hidden": true as const }
    : { role: "img", "aria-label": "ShipItSwifty" };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      {...a11yProps}
    >
      <path
        d="M14 40C14 40 10 32 12 20C14 8 22 2 30 4C30 4 32 14 28 24C24 34 14 40 14 40Z"
        fill="#8B5CF6"
      />
      <path d="M30 4C34 0 38 1 38 5C38 11 32 17 28 24C28 24 30 14 30 4Z" fill="#A78BFA" />
      <path d="M14 40C11 45 16 50 18 45C19 42 15 40 14 40Z" fill="#8B5CF6" opacity="0.55" />
      <circle cx="24" cy="18" r="3.5" fill="#0D1117" opacity="0.45" />
    </svg>
  );
}
