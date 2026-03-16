"use client";
import { ChatService } from "@/api_services/chat/chat.service";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import { Divider } from "@/components/shared/Divider";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LinearTextBlock from "../SinglePropertyAccards/LinearTextBlock";
import SinglePropContactInfoModal from "./SinglePropContactInfoModal";

const SinglePropRequestedReserveModal = ({
  data,
  show,
  onHide,
  startDate,
  count,
  endDate,
}: {
  data: SinglePropDto;
  show: boolean;
  onHide: () => void | null;
  endDate: string;
  startDate: string;
  count: string | number;
}) => {
  const router = useRouter();
  const [contactType, setContactType] = useState<"tel" | "sms" | "">("");
  const [loading, setLoading] = useState(false);
  const showLogin = () => {
    useStoreParams.setState({ loginModal: true });
  };

  const { mutate: createFindChat } = useMutation({
    mutationFn: ChatService.StartOrFindChat,
    onSuccess: (e) => {
      router.push(`/chat/${e?.chatroom_id}`);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const onCreateChat = () => {
    createFindChat({ property_id: data?.id });
  };

  const onContactClick = (type: "sms" | "tel") => {
    setContactType(type);
  };
  const onContactClose = () => {
    setContactType("");
  };

  const { mutate } = useMutation({ mutationFn: ReserveService.createReserve });

  const onActionsClick = (user_action: number) => {
    setLoading(true);
    mutate(
      {
        check_in: moment(startDate, "jYYYY/jMM/jD").format("YYYY-MM-DD"),
        check_out: moment(endDate, "jYYYY/jMM/jD").format("YYYY-MM-DD"),
        guests_count: `${count}`,
        property_id: data?.id,
        user_action: user_action,
      },
      {
        onSuccess: () => {
          if (user_action == 1) {
            setLoading(false);
            onContactClick("tel");
          } else if (user_action == 2) {
            setLoading(false);
            onContactClick("sms");
          } else if (user_action == 3) {
            onCreateChat();
          }
          onHide();
        },
        onError: () => {
          setLoading(false);
        },
      },
    );
  };
  return (
    <>
      <ModalBottomSheet
        onHide={onHide}
        show={show}
        options={{
          containerClass: `mx-auto rounded-t-20 absolute pb-[1.5rem] md:pb-10 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(50svw)]  bg-primary-50 dark:bg-zinc-900 overflow-y-scroll  dark:bg-dark-700`,
        }}
      >
        <div className="w-full flex flex-col   p-4 rounded-2xl     gap-4">
          <div className="w-full grid grid-cols-4 gap-2">
            <div className="w-full  aspect-square relative ">
              <Image
                fill
                alt={data?.feature_image?.alt || ""}
                className=" rounded-2xl  w-full object-cover aspect-square"
                src={NEW_IMAGE_URL(data?.feature_image)}
              />
            </div>
            <p className=" font-medium text-lg w-full  col-span-3 md:text-xl ">{data?.title}</p>{" "}
          </div>
          <Divider />
          <div className="w-full flex flex-col gap-2">
            <LinearTextBlock
              options={{ title_class: " !font-normal" }}
              title={_STRINGS.START_DATE}
              value={` ${moment(startDate, "jYYYY/jMM/jD").format("ddd")} - ${startDate}`}
            />
            <LinearTextBlock
              title={_STRINGS.EXIT_DATE}
              value={`${moment(endDate, "jYYYY/jMM/jD").format("ddd")} - ${endDate} `}
              options={{ title_class: " !font-normal" }}
            />
            <LinearTextBlock title={_STRINGS.PPL_COUNT} value={count} options={{ title_class: " !font-normal" }} />
          </div>
          <Divider />
          <div className="w-full flex flex-col items-center justify-center gap-2">
            {!!data?.remaining_days ? (
              <>
                <Button
                  onClick={() => {
                    onActionsClick(1);
                  }}
                  width="w-full  !py-2  !font-bold  !text-sm "
                  containerClass="w-1/2"
                  roundedClass="rounded-full"
                  title={_STRINGS.CALL}
                  variant="outline"
                  loading={loading}
                  icon={<img className="w-4 h-4  aspect-square" src="/assets/icons/advisor/blue_phone.svg" />}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    onActionsClick(2);
                  }}
                  width="w-full  !py-2  !font-bold  !text-sm "
                  containerClass="w-1/2"
                  roundedClass="rounded-full"
                  title={_STRINGS.SMS}
                  icon={<img className="w-4 h-4  ml-1 aspect-square" src="/assets/icons/advisor/blue_sms.svg" />}
                  loading={loading}
                />
              </>
            ) : (
              <></>
            )}
            {data?.is_chat_enabled ? (
              <Button
                width="w-full !py-2  !font-bold !text-sm "
                containerClass="w-1/2  "
                roundedClass="rounded-full"
                title={_STRINGS.CHAT_IN_JAYAB}
                icon={<img className="w-4 h-4  ml-1 aspect-square" src="/assets/icons/advisor/white_message.svg" />}
                onClick={() => {
                  onActionsClick(3);
                }}
                loading={loading}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </ModalBottomSheet>
      <SinglePropContactInfoModal type={contactType} show={!!contactType} data={data} onHide={onContactClose} />
    </>
  );
};

export default SinglePropRequestedReserveModal;
