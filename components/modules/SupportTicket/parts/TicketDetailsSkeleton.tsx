import { useTranslations } from "next-intl";

const TicketDetailsSkeleton = () => {
  const t = useTranslations("profile");

  return (
    <div
      className="flex animate-pulse flex-col gap-4 motion-reduce:animate-none"
      role="status"
      aria-label={t("loadingTicket")}
    >
      <div className="h-32 w-full rounded-lg bg-surface-hover" />
      <div className="h-24 w-4/5 self-end rounded-lg bg-surface-hover" />
      <div className="h-24 w-4/5 rounded-lg bg-surface-hover" />
    </div>
  );
};

export default TicketDetailsSkeleton;
