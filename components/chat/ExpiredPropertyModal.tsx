import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useRouter } from "next/navigation";

import LottieLoading from "../shared/Lotties/LottieLoading";
import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "../shared/CmsText";
import Button from "../shared/Button/Button";
import Modal from "../Modal";

const ExpiredPropertyModal = ({
  visibleModal,
  setVisibleModal,
  singleChatData,
}: {
  visibleModal: boolean;
  setVisibleModal: (e: any) => void | null;
  singleChatData: SingleChatDetailsDto | undefined;
}) => {
  const { push } = useRouter();
  const onHideFunc = () => {
    setVisibleModal(false);
  };

  const goExtend = () => {
    push(
      `/profile/owner/properties/${singleChatData?.property?.id}/subscription`,
    );
  };

  const { content: data, isLoading } = useCmsContent("addExpireMessage", {
    enabled: visibleModal,
  });

  return (
    <Modal
      options={{
        containerClass:
          "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg overflow-y-scroll  bg-white  dark:bg-zinc-800",
      }}
      show={visibleModal}
      onHide={onHideFunc}
    >
      <div className=" py-5 flex-col items-center  justify-center  gap-4 flex px-3">
        {isLoading || !data ? (
          <LottieLoading />
        ) : (
          <>
            <img src={NEW_IMAGE_URL(data?.feature_image)} className="w-60  " />
            <div className="flex flex-col w-full gap-2 items-center justify-center">
              <CmsText className=" font-medium">
                {data?.small_text || _STRINGS.ROOM_EXPIRED_NOTICE}
              </CmsText>
              <CmsText className="  opacity-65  text-sm text-center  ">
                {data?.full_text}
              </CmsText>
            </div>
            <div className="w-full flex justify-between items-center gap-4 ">
              <Button
                title={_STRINGS.EXTEND_SUBS}
                width="w-full"
                containerClass="w-full"
                onClick={goExtend}
              />
              <Button
                width="w-full"
                variant="outline"
                onClick={onHideFunc}
                title={_STRINGS.LATER}
                containerClass="w-full"
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ExpiredPropertyModal;
