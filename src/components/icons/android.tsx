interface IconProps {
  size?: number;
  className?: string;
  "aria-hidden"?: boolean;
}

export function AndroidIcon({ size = 16, className, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...rest}
    >
      <path d="M17.523 15.341a1.018 1.018 0 1 1 0-2.035 1.018 1.018 0 0 1 0 2.035m-11.046 0a1.018 1.018 0 1 1 0-2.035 1.018 1.018 0 0 1 0 2.035m11.41-6.02 2.034-3.523a.422.422 0 1 0-.732-.422l-2.06 3.567A12.79 12.79 0 0 0 12 7.794c-1.864 0-3.624.41-5.13 1.149L4.81 5.376a.422.422 0 1 0-.731.422l2.034 3.523C2.617 11.184.225 14.692 0 18.819h24c-.225-4.127-2.617-7.635-6.114-9.498" />
    </svg>
  );
}
