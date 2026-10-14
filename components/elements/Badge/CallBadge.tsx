import type { CallBadgeProps } from "@/types/components/elements/badge";

const CallBadge = ({ label, className = "" }: CallBadgeProps) => (
  <span
    role="img"
    title={label}
    aria-label={label}
    className={`flex size-6 items-center justify-center rounded-full border-2 border-white bg-success-600 text-white shadow ${className}`}
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <path
        fill="currentColor"
        stroke="none"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
      />
      <path d="M14.05 2a9 9 0 0 1 8 7.94M14.05 6A5 5 0 0 1 18 10" />
    </svg>
  </span>
);

export default CallBadge;
