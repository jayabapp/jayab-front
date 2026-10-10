import { useTranslations } from "next-intl";

const ChatSecurityNotice = () => {
  const t = useTranslations("chat");

  return (
    <aside
      aria-label={t("chatSecurityWarningTitle")}
      className="border-t border-status-warning-line bg-status-warning-bg px-4 py-2 text-right text-xs leading-5 text-status-warning md:px-5"
    >
      <p>
        <strong>{t("chatSecurityWarningTitle")}:</strong>{" "}
        {t("chatSecurityWarningStart")}{" "}
        <strong>{t("chatSecurityWarningSensitiveInfo")}</strong>{" "}
        {t("chatSecurityWarningEnd")}
      </p>
      <p className="mt-1">{t("chatSecurityWarningLegal")}</p>
    </aside>
  );
};

export default ChatSecurityNotice;
