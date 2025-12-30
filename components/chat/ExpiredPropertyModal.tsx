import { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import _STRINGS from "@/utils/LocalStrings";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import Button from "../shared/Button/Button";

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
        <p className=" font-medium">{_STRINGS.ROOM_EXPIRED_NOTICE}</p>

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
      </div>
    </Modal>
  );
};

export default ExpiredPropertyModal;
