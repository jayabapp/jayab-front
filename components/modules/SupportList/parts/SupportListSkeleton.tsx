import { useTranslations } from "next-intl";

import SupportCardSkeleton from "./SupportCardSkeleton";

const SupportListSkeleton = () => {
  const t = useTranslations("profile");

  return (
    <div
      className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2"
      role="status"
      aria-label={t("loadingTickets")}
    >
      {Array.from({ length: 4 }, (_, index) => (
        <SupportCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default SupportListSkeleton;
