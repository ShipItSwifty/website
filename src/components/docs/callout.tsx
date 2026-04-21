import type { ReactNode } from "react";
import { Info, AlertTriangle, AlertOctagon, Lightbulb } from "lucide-react";

type CalloutVariant = "info" | "warning" | "danger" | "tip";

const STYLES: Record<CalloutVariant, { color: string; bg: string; Icon: typeof Info }> = {
  info: { color: "var(--blue)", bg: "rgba(88,166,255,0.08)", Icon: Info },
  warning: { color: "var(--amber)", bg: "rgba(210,153,34,0.08)", Icon: AlertTriangle },
  danger: { color: "var(--red)", bg: "rgba(248,81,73,0.08)", Icon: AlertOctagon },
  tip: { color: "var(--green)", bg: "rgba(63,185,80,0.08)", Icon: Lightbulb },
};

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

export function Callout({ variant = "info", title, children }: CalloutProps) {
  const { color, bg, Icon } = STYLES[variant];
  return (
    <div
      className="my-4 flex gap-3 rounded-lg border p-4"
      style={{ borderColor: `${color}40`, background: bg }}
      role="note"
    >
      <Icon size={18} style={{ color, marginTop: 2, flexShrink: 0 }} />
      <div>
        {title && (
          <div
            className="mb-1 text-sm font-semibold"
            style={{ color, fontFamily: "var(--font-display)" }}
          >
            {title}
          </div>
        )}
        <div className="text-[14px] leading-[1.65]" style={{ color: "var(--fg1)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
