"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import { SupportService } from "@/api_services/support/support.service";
import Breadcrumbs from "@/components/BreadCrumbs";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import Message from "@/components/support/Message";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Notify from "@/components/shared/Toast";
import Modal from "@/components/Modal";
import { useStoreSocket } from "@/store";

const TicketsPage = () => {
  const { notification } = useStoreSocket((e) => e);
  const params = useParams();
  const [message, setMessage] = useState<string>("");
  const [disabled, setDisabled] = useState(false);

  const [visibleModal, setVisibleModal] = useState(false);
  const { data, refetch, isLoading } = useQuery({
    queryKey: [SupportService?.SINGLE_TICKET_GET_CACHEKEY, params?.id],
    queryFn: () => SupportService.GetSingleTicket({ id: `${params?.id}` }),
    gcTime: 0,
    staleTime: 0,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: SupportService.ReplySingleTicket,
    onSuccess: () => {
      setDisabled(false);
      setVisibleModal(false);
      // setTitle("");
      setMessage("");
      refetch();
    },
    onError: () => {
      setDisabled(false);
    },
  });

  async function handleSubmitMessage() {
    if (!message) return Notify({ type: "warn", title: "تکمیل فرم", body: "لطفا متن پیام را وارد نمایید" });
    setDisabled(true);

    mutate({ message, id: `${params?.id}` });
  }

  useEffect(() => {
    if (notification?.eventData?.event_type == "NewTicket" && notification?.eventData?.event_id == params?.id) {
      refetch();
    }
  }, [notification]);
  return (
    <div
      id="homeParent"
      className=" profile-container flex flex-col gap-4   !pb-24 transition-all duration-500 ease-in-out "
    >
      {isLoading ? (
        <LottieLoading />
      ) : (
        <>
          <div className="w-full">
            <Message item={data} />
          </div>
          <div className="mt-4 w-full flex flex-col gap-y-4">
            {data?.replies?.map((e: any) => (
              <div key={e?.id} className={` flex ${!!e?.by_admin ? "justify-end" : "justify-start"} `}>
                <Message item={e} />
              </div>
            ))}
          </div>

          {/* {data?.status == 20 && ( */}
          <div className="fixed translate-x-1/2 right-1/2  bottom-0  w-full p-4 responsive-width z-40 flex flex-col items-center  ">
            <Button
              disabled={data?.status == 100}
              title={data?.status == 100 ? _STRINGS.TICKET_CLOSED : _STRINGS.ANSWER_MESSAGE}
              onClick={() => setVisibleModal(true)}
              // icon={<ChatBubbleLeftEllipsisIcon className="w-6 ml-2" />}
            />

            <Modal show={visibleModal} onHide={() => setVisibleModal(false)}>
              <div className=" py-5 flex-col gap-4 flex px-3">
                <MultiLineFormInput
                  item={{
                    title: _STRINGS.MESSAGE_TEXT,
                    placeholder: _STRINGS.WRITE_MESSAGE_TEXT,
                    isMandatory: true,
                    maxLength: 500,
                    rows: 6,
                  }}
                  onChangeText={(v: string) => setMessage(v)}
                  value={message}
                />
                <Button loading={disabled} title={_STRINGS.SEND} width="w-full" onClick={handleSubmitMessage} />
              </div>
            </Modal>
          </div>
          {/* )} */}
        </>
      )}
    </div>
  );
};

export default TicketsPage;
