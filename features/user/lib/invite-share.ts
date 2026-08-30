type ReferralProfile = {
  is_special?: boolean;
  user?: { referral_code?: string };
};

const SHARE_TITLE = "جایاب";

export const buildInviteShare = (
  profile: ReferralProfile | null | undefined,
  origin: string,
) => {
  const code = profile?.is_special
    ? `کد دعوت: ${profile?.user?.referral_code}`
    : "";
  return {
    text: `شما را به جایاب دعوت میکنم\n${code}\n✅${origin}`,
    title: SHARE_TITLE,
  };
};
