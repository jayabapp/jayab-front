import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { HomeService } from "@/api_services/home/home.service";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import Button from "../shared/Button/Button";
import LottieLoading from "../shared/Lotties/LottieLoading";

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
    push(`/profile/owner/properties/${singleChatData?.property?.id}/subscription`);
  };

  const { data: addExpireMessage, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "addExpireMessage", 1, visibleModal],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "addExpireMessage" });
    },
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
        {isLoading ? (
          <LottieLoading />
        ) : (
          <>
            <img src={NEW_IMAGE_URL(addExpireMessage?.feature_image)} className="w-60  " />

            <p className=" font-medium">{addExpireMessage?.small_text || _STRINGS.ROOM_EXPIRED_NOTICE}</p>
            <p className=" whitespace-nowrap ">{addExpireMessage?.full_text}</p>

            <div className="w-full flex justify-between items-center gap-4 ">
              <Button title={_STRINGS.EXTEND_SUBS} width="w-full" containerClass="w-full" onClick={goExtend} />
              <Button
                title={_STRINGS.LATER}
                variant="outline"
                width="w-full"
                containerClass="w-full"
                onClick={onHideFunc}
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ExpiredPropertyModal;
