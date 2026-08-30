import type { ReservationGuestContactProps } from "@/types/components/modules/reservations";
import { ContentImage } from "@elements/Image";
import { Divider } from "@elements/Divider";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const ACTION_WIDTH =
  "w-full h-12 !border-none !text-black !font-normal !py-2 !bg-neutral-50 !text-sm";

const ReservationGuestContact = ({
  isExpired,
  onStartChat,
  isChatPending,
  onContactRequest,
}: ReservationGuestContactProps) => {
  const disabledStyle = isExpired ? " !text-neutral-400" : "";
  const disabledIcon = isExpired ? " opacity-50 grayscale" : "";

  return (
    <>
      <Divider moreClass=" " />
      <div className="w-full flex flex-col items-center justify-center gap-2">
        {isExpired ? null : (
          <>
            <Button
              variant="outline"
              title={_STRINGS.CALL}
              roundedClass=" rounded-xl"
              containerClass="w-full lg:w-1/2 "
              width={`${ACTION_WIDTH}${disabledStyle}`}
              onClick={() => onContactRequest?.("call")}
              icon={
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  src="/assets/icons/advisor/blue_phone.svg"
                  className={`w-4 h-4 absolute right-3 top-0 bottom-0 my-auto aspect-square${disabledIcon}`}
                />
              }
            />
            <Button
              variant="outline"
              title={_STRINGS.SMS}
              roundedClass=" rounded-xl"
              containerClass="w-full lg:w-1/2 "
              width={`${ACTION_WIDTH}${disabledStyle}`}
              onClick={() => onContactRequest?.("sms")}
              icon={
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  src="/assets/icons/advisor/blue_sms.svg"
                  className={`w-4 h-4 absolute right-3 top-0 bottom-0 my-auto ml-1 aspect-square${disabledIcon}`}
                />
              }
            />
          </>
        )}

        <Button
          variant="outline"
          width={ACTION_WIDTH}
          onClick={onStartChat}
          loading={isChatPending}
          disabled={isChatPending}
          roundedClass=" rounded-xl"
          containerClass="w-full lg:w-1/2 "
          title={_STRINGS.CHAT_IN_JAYAB}
          icon={
            <ContentImage
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 absolute right-3 top-0 bottom-0 my-auto ml-1 aspect-square"
              src="/assets/icons/reserve/blue_chat_reserve.svg"
            />
          }
        />
      </div>
    </>
  );
};

export default ReservationGuestContact;
