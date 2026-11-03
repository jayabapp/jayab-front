import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { DiscoveryMapProblemProps } from "@/types/components/modules/discovery-map";

const ACTION_CLASS =
  "flex h-11 cursor-pointer items-center justify-center rounded-full border border-line-strong px-5 text-sm font-medium text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2";

const DiscoveryMapProblem = ({
  title,
  hint,
  onBack,
  onRetry,
}: DiscoveryMapProblemProps) => {
  const t = useTranslations();

  return (
    <div
      role="alert"
      className="flex size-full flex-col items-center justify-center gap-3 bg-surface-muted p-6 text-center"
    >
      <Icon name="map-pin" size={32} className="text-ink-subtle" />
      <p className="text-sm font-medium text-ink">{title}</p>
      {hint ? <p className="text-xs text-ink-subtle">{hint}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <button type="button" onClick={onRetry} className={ACTION_CLASS}>
            {t("common.tryAgain")}
          </button>
        ) : null}
        {onBack ? (
          <button type="button" onClick={onBack} className={ACTION_CLASS}>
            {t("listing.mapBackToList")}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default DiscoveryMapProblem;
