import _STRINGS from "@/utils/LocalStrings";

const ChatSecurityNotice = () => (
  <aside
    aria-label={_STRINGS.CHAT_SECURITY_WARNING_TITLE}
    className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-right text-xs leading-5 text-amber-950 md:px-5"
  >
    <p>
      <strong>{_STRINGS.CHAT_SECURITY_WARNING_TITLE}:</strong>{" "}
      {_STRINGS.CHAT_SECURITY_WARNING_START}{" "}
      <strong>{_STRINGS.CHAT_SECURITY_WARNING_SENSITIVE_INFO}</strong>{" "}
      {_STRINGS.CHAT_SECURITY_WARNING_END}
    </p>
    <p className="mt-1">{_STRINGS.CHAT_SECURITY_WARNING_LEGAL}</p>
  </aside>
);

export default ChatSecurityNotice;
