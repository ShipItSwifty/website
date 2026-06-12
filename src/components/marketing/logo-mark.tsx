import Image from "next/image";

interface LogoMarkProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function LogoMark({ size = 26, className, ...rest }: LogoMarkProps) {
  const hidden = rest["aria-hidden"];
  const a11yProps = hidden
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": "ShipItSwifty" };
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      className={`block object-contain ${className ?? ""}`}
      alt={hidden ? "" : "ShipItSwifty"}
      {...a11yProps}
    />
  );
}
