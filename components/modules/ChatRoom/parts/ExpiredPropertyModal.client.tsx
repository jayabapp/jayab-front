import { resolveChatImage } from "@features/chat/presentation/chat.presenter";
import { useTranslations } from "next-intl";
import { ContentImage } from "@/components/elements/Image";
import { useRouter } from "next/navigation";

import type { ExpiredPropertyProps } from "@/types/components/modules/chat";

import CmsContentSkeleton from "@elements/Skeleton/CmsContentSkeleton";
import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const ExpiredPropertyModal = ({
  visibleModal,
  singleChatData,
  setVisibleModal,
}: ExpiredPropertyProps) => {
  const t = useTranslations();

  const { push } = useRouter();
  const onHideFunc = () => setVisibleModal(false);

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
          "mx-auto my-20   w-11/12 md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-lg overflow-y-scroll  bg-surface  ",
      }}
      show={visibleModal}
      onHide={onHideFunc}
    >
      <div className=" py-5 flex-col items-center  justify-center  gap-4 flex px-3">
        {isLoading || !data ? (
          <CmsContentSkeleton />
        ) : (
          <>
            <ContentImage
              width={512}
              height={512}
              sizes="240px"
              alt={data?.title || ""}
              className="w-60 h-auto"
              src={resolveChatImage(data?.feature_image)}
            />
            <div className="flex flex-col w-full gap-2 items-center justify-center">
              <CmsText className=" font-medium">
                {data?.small_text || t("chat.roomExpiredNotice")}
              </CmsText>
              <CmsText className="  opacity-65  text-sm text-center  ">
                {data?.full_text}
              </CmsText>
            </div>
            <div className="w-full flex justify-between items-center gap-4 ">
              <Button
                width="w-full"
                onClick={goExtend}
                containerClass="w-full"
                title={t("common.extendSubs")}
              />
              <Button
                width="w-full"
                variant="outline"
                onClick={onHideFunc}
                title={t("chat.later")}
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
