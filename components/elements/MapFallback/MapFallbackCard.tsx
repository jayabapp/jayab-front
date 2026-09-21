import { Icon } from "@elements/Icon";

import type { MapFallbackCardProps } from "@/types/components/elements/map";

const MapFallbackCard = ({
  href,
  title,
  message,
  className,
  actionLabel,
}: MapFallbackCardProps) => (
  <div
    className={`flex flex-col items-start justify-center gap-3 rounded-20 bg-neutral-50 p-4 text-sm text-neutral-800 ${className ?? ""}`}
  >
    {title ? (
      <div className="flex items-center gap-2 font-medium">
        <Icon name="map-pin" size={20} />
        <span>{title}</span>
      </div>
    ) : (
      <></>
    )}
    {message ? <p className="text-xs text-neutral-500">{message}</p> : <></>}
    {href && actionLabel ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {actionLabel}
      </a>
    ) : (
      <></>
    )}
  </div>
);

export default MapFallbackCard;
