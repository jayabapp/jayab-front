import type { IconName, IconProps } from "@/types/components/elements/icon";
import type { JSX } from "react";

const PATHS: Record<IconName, JSX.Element> = {
  bath: (
    <>
      <path d="M3 12.25h18" />
      <path d="M5 12.25v3.25a3.5 3.5 0 0 0 3.5 3.5h7a3.5 3.5 0 0 0 3.5-3.5v-3.25" />
      <path d="M7.5 12.25V6.5a2 2 0 0 1 4 0" />
      <path d="M7 19v1.5" />
      <path d="M17 19v1.5" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18.5V6.5" />
      <path d="M3 12h13.5a4.5 4.5 0 0 1 4.5 4.5v2" />
      <path d="M7 12V9.5h4.5V12" />
      <path d="M3 15.75h18" />
    </>
  ),
  bookmark: <path d="M6.5 3.75h11v16.5L12 16.3l-5.5 3.95z" />,
  broom: (
    <>
      <path d="m4 20 4.5-4.5" />
      <path d="m10.5 12.5 4-4 5 5-4 4z" />
      <path d="M9 14.5 12 20" />
      <path d="m12.5 11 3.5 6.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.75" y="5.75" width="16.5" height="14.5" rx="2.5" />
      <path d="M8 3.5v4.5" />
      <path d="M16 3.5v4.5" />
      <path d="M3.75 10.75h16.5" />
    </>
  ),
  chat: (
    <path d="M4.5 7a2.5 2.5 0 0 1 2.5-2.5h10A2.5 2.5 0 0 1 19.5 7v6.5a2.5 2.5 0 0 1-2.5 2.5h-7L5.5 19.5V16H7a2.5 2.5 0 0 1-2.5-2.5z" />
  ),
  check: <path d="m5.5 12.5 4.5 4.5 8.5-9" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  "chevron-left": <path d="M14.5 5.5 8 12l6.5 6.5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.25V12l3.25 2" />
    </>
  ),
  copy: (
    <>
      <rect x="8.75" y="8.75" width="11.5" height="11.5" rx="2.5" />
      <path d="M15.25 8.75V6.5a2.75 2.75 0 0 0-2.75-2.75H6.5A2.75 2.75 0 0 0 3.75 6.5v6A2.75 2.75 0 0 0 6.5 15.25h2.25" />
    </>
  ),
  expand: (
    <>
      <path d="M14.5 4.5h5v5" />
      <path d="m19.5 4.5-6 6" />
      <path d="M9.5 19.5h-5v-5" />
      <path d="m4.5 19.5 6-6" />
    </>
  ),
  heart: (
    <path d="M12 20.25S4.5 15.4 4.5 10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.8c0 5.2-7.5 10.05-7.5 10.05Z" />
  ),
  home: (
    <>
      <path d="M3.25 10.75 12 3.5l8.75 7.25" />
      <path d="M5.5 9.5v10.75h13V9.5" />
      <path d="M10 20.25V14.5h4v5.75" />
    </>
  ),
  images: (
    <>
      <rect x="8" y="3.75" width="12.25" height="12.25" rx="2.5" />
      <path d="M16 16v1.75a2.5 2.5 0 0 1-2.5 2.5H6.25a2.5 2.5 0 0 1-2.5-2.5V10.5A2.5 2.5 0 0 1 6.25 8H8" />
      <path d="m10.5 12.75 2.5-2.5 3.25 3.25" />
      <path d="M17.25 7.75h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.75h.01" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 20.75s6.75-5.55 6.75-10.75a6.75 6.75 0 1 0-13.5 0C5.25 15.2 12 20.75 12 20.75Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  minus: <path d="M5.5 12h13" />,
  phone: (
    <path d="M7.4 3.9 9.9 8.3 8 10.2a12.2 12.2 0 0 0 5.8 5.8l1.9-1.9 4.4 2.5-1.2 3.1c-.4 1-1.4 1.6-2.4 1.4C10 19.9 4.1 14 2.9 6.5c-.2-1 .4-2 1.4-2.4z" />
  ),
  plus: (
    <>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </>
  ),
  pool: (
    <>
      <path d="M2.75 17.5c1.6 0 1.6 1.45 3.2 1.45s1.6-1.45 3.2-1.45 1.6 1.45 3.2 1.45 1.6-1.45 3.2-1.45 1.6 1.45 3.2 1.45" />
      <path d="M7.5 16V6.25a2.25 2.25 0 0 1 4.5 0" />
      <path d="M14.5 16V6.25a2.25 2.25 0 0 1 4.5 0" />
      <path d="M7.5 10.5H12" />
      <path d="M14.5 10.5H19" />
    </>
  ),
  ruler: (
    <>
      <path d="M3.9 15.15 15.15 3.9a1.5 1.5 0 0 1 2.12 0l2.83 2.83a1.5 1.5 0 0 1 0 2.12L8.85 20.1a1.5 1.5 0 0 1-2.12 0L3.9 17.27a1.5 1.5 0 0 1 0-2.12Z" />
      <path d="m8 11 1.75 1.75" />
      <path d="m11 8 1.75 1.75" />
      <path d="m14 5 1.75 1.75" />
    </>
  ),
  share: (
    <>
      <circle cx="17.5" cy="6" r="2.75" />
      <circle cx="6.5" cy="12" r="2.75" />
      <circle cx="17.5" cy="18" r="2.75" />
      <path d="m9 10.65 6-3.2" />
      <path d="m9 13.35 6 3.2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.25 5 6v6c0 4.2 3 7.25 7 8.75 4-1.5 7-4.55 7-8.75V6z" />
      <path d="m9.25 11.75 2 2 3.5-3.5" />
    </>
  ),
  sms: (
    <>
      <rect x="3.75" y="5.75" width="16.5" height="12.5" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 4.25 13.7 9l4.75 1.7L13.7 12.4 12 17.15 10.3 12.4 5.55 10.7 10.3 9z" />
      <path d="M18.5 4v2.5" />
      <path d="M17.25 5.25h2.5" />
    </>
  ),
  star: (
    <path d="m12 4.25 2.5 5.06 5.6.82-4.05 3.94.96 5.58L12 17.02l-5.01 2.63.96-5.58L3.9 10.13l5.6-.82z" />
  ),
  toilet: (
    <>
      <path d="M6.5 3.75h9v6.5a4.5 4.5 0 0 1-9 0z" />
      <path d="M11 14.75v5.5" />
      <path d="M7.5 20.25h7" />
    </>
  ),
  "user-plus": (
    <>
      <circle cx="10" cy="8" r="3.25" />
      <path d="M3.75 19.5c0-3.2 2.8-5.25 6.25-5.25s6.25 2.05 6.25 5.25" />
      <path d="M18.5 7v5" />
      <path d="M16 9.5h5" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.25" />
      <path d="M3.25 19.5c0-3.2 2.8-5.25 6.25-5.25s6.25 2.05 6.25 5.25" />
      <path d="M16.25 5.15a3.25 3.25 0 0 1 0 5.7" />
      <path d="M17.5 14.5c1.95.55 3.25 2.05 3.25 4.35" />
    </>
  ),
  x: (
    <>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
};

const Icon = ({ className = "", name, size = 20 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`shrink-0 ${className}`}
  >
    {PATHS[name]}
  </svg>
);

export default Icon;
