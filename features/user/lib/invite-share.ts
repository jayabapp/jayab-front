import type { Translate } from "@/types/i18n";

type ReferralProfile = {
  is_special?: boolean;
  user?: { referral_code?: string };
};

export const buildInviteShare = (
  profile: ReferralProfile | null | undefined,
  origin: string,
  t: Translate,
) => {
  const code = profile?.is_special
    ? t("profile.inviteCodeLine", { code: profile?.user?.referral_code ?? "" })
    : "";
  return {
    text: `${t("profile.inviteShareText")}\n${code}\n✅${origin}`,
    title: t("common.brandName"),
  };
};
