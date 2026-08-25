"use client";

import { useEffect, useState } from "react";
import { useSupportTicket } from "@features/support/hooks/useSupportTicket";
import { useStoreSocket } from "@/store";
import { useParams } from "next/navigation";

import TicketDetailsSkeleton from "@/components/support/TicketDetailsSkeleton";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import _STRINGS from "@/utils/LocalStrings";
import Message from "@/components/support/Message";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import Modal from "@/components/Modal";

const TicketsPage = () => {
  const params = useParams<{ id: string }>();
  const { notification } = useStoreSocket((state) => state);
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { data, isPending, isReplyPending, refresh, reply } = useSupportTicket(
    params.id,
  );

  const handleSubmitMessage = () => {
    if (!message.trim()) {
      Notify({
        type: "warn",
        title: "تکمیل فرم",
        body: "لطفا متن پیام را وارد نمایید",
      });
      return;
    }

    reply(
      { id: params.id, message: message.trim() },
      {
        onSuccess: () => {
          setVisibleModal(false);
          setMessage("");
        },
      },
    );
  };

  useEffect(() => {
    const eventData = notification?.eventData;
    if (
      eventData?.event_type === "NewTicket" &&
      String(eventData.event_id) === params.id
    ) {
      void refresh();
    }
  }, [notification, params.id, refresh]);

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 !pb-24 transition-all duration-500 ease-in-out"
    >
      {isPending ? (
        <TicketDetailsSkeleton />
      ) : (
        <>
          <div className="w-full">
            <Message item={data} />
          </div>
          <div className="mt-4 flex w-full flex-col gap-y-4">
            {data?.replies.map((ticketReply) => (
              <div
                key={ticketReply.id}
                className={`flex ${ticketReply.by_admin ? "justify-end" : "justify-start"}`}
              >
                <Message item={ticketReply} />
              </div>
            ))}
          </div>
          <div className="responsive-width fixed bottom-0 right-1/2 z-40 flex w-full translate-x-1/2 flex-col items-center border-t bg-white p-4 md:translate-x-1/4 md:border-none md:bg-transparent">
            <Button
              disabled={data?.status === 100}
              title={
                data?.status === 100
                  ? _STRINGS.TICKET_CLOSED
                  : _STRINGS.ANSWER_MESSAGE
              }
              onClick={() => setVisibleModal(true)}
              width="!w-full !border !border-white"
              containerClass="w-1/2 md:w-1/3"
            />
            <Modal show={visibleModal} onHide={() => setVisibleModal(false)}>
              <div className="flex flex-col gap-4 px-3 py-5">
                <MultiLineFormInput
                  item={{
                    title: _STRINGS.MESSAGE_TEXT,
                    placeholder: _STRINGS.WRITE_MESSAGE_TEXT,
                    isMandatory: true,
                    maxLength: 500,
                    rows: 6,
                  }}
                  onChangeText={setMessage}
                  value={message}
                />
                <Button
                  loading={isReplyPending}
                  title={_STRINGS.SEND}
                  width="w-full"
                  onClick={handleSubmitMessage}
                />
              </div>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketsPage;
