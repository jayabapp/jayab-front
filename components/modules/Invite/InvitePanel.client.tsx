"use client";

import { useReferralProfile } from "@features/user/hooks/useReferralProfile";
import { buildInviteShare } from "@features/user/lib/invite-share";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const InvitePanel = () => {
  const { data: referral } = useReferralProfile();

  const onShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share(buildInviteShare(referral, window.origin));
    } catch {
      // A dismissed share sheet rejects; that is not an error worth surfacing.
    }
  };

  return (
    <div className="w-full md:px-[30%] mt-12 flex flex-col gap-4">
      <ContentImage
        width={768}
        height={512}
        className="h-auto w-full"
        alt={_STRINGS.INVITE_TEXT}
        sizes="(min-width: 768px) 40vw, 100vw"
        src="/assets/images/shared/invite_image.png"
      />
      <p className="text-center">{_STRINGS.INVITE_TEXT}</p>

      {referral?.is_special ? (
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <p className="text-sm">{_STRINGS.REFRAL_CODE}</p>
          <div className="w-32 h-10 flex items-center justify-center border rounded-10 text-sm">
            <p>{referral?.user?.referral_code}</p>
          </div>
        </div>
      ) : null}

      <Button
        width="w-full"
        onClick={onShare}
        containerClass="w-full"
        title={_STRINGS.SHARE}
      />
    </div>
  );
};

export default InvitePanel;
