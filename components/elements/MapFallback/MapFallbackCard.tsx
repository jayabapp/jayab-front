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
    className={`flex flex-col items-start justify-center gap-3 rounded-20 bg-surface-muted p-4 text-sm text-ink ${className ?? ""}`}
  >
    {title ? (
      <div className="flex items-center gap-2 font-medium">
        <Icon name="map-pin" size={20} />
        <span>{title}</span>
      </div>
    ) : (
      <></>
    )}
    {message ? <p className="text-xs text-ink-subtle">{message}</p> : <></>}
    {href && actionLabel ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        {actionLabel}
      </a>
    ) : (
      <></>
    )}
  </div>
);

export default MapFallbackCard;
