"use client";

import { useReplyToSupportTicket } from "@features/support/hooks/useReplyToSupportTicket";
import { type SupportFormErrors } from "@features/support/model/support.schema";
import { getSupportFormErrors } from "@features/support/model/support.schema";
import { supportReplySchema } from "@features/support/model/support.schema";
import { useSupportTicket } from "@features/support/hooks/useSupportTicket";
import { useEffect, useState } from "react";
import { useStoreSocket } from "@/store";

import type { SupportTicketModuleProps } from "@/types/features/support/components";

import TicketDetailsSkeleton from "./parts/TicketDetailsSkeleton";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import TicketMessage from "./parts/TicketMessage";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Modal from "@/components/Modal";

const SupportTicket = ({ ticketId }: SupportTicketModuleProps) => {
  const { notification } = useStoreSocket((state) => state);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<SupportFormErrors>({});
  const [visibleModal, setVisibleModal] = useState(false);
  const { ticket, isPending, isError, refresh } = useSupportTicket(ticketId);
  const { mutate: reply, isPending: isReplyPending } = useReplyToSupportTicket(ticketId);

  const handleSubmitMessage = () => {
    try {
      supportReplySchema.validateSync({ message }, { abortEarly: false });
      setErrors({});
    } catch (error) {
      setErrors(getSupportFormErrors(error));
      return;
    }

    reply(
      { id: ticketId, message: message.trim() },
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
    if (eventData?.event_type === "NewTicket" && String(eventData.event_id) === ticketId) {
      void refresh();
    }
  }, [notification, refresh, ticketId]);

  if (isPending) return <TicketDetailsSkeleton />;

  return (
    <div className="flex flex-col gap-4">
      {isError ? (
        <div role="alert" className="rounded-lg bg-danger-50 p-4 text-sm text-danger-500">
          {_STRINGS.SUPPORT_DETAILS_ERROR}
        </div>
      ) : (
        <>
          <div className="w-full">
            <TicketMessage item={ticket} />
          </div>
          <div className="mt-4 flex w-full flex-col gap-y-4">
            {ticket?.replies.map((ticketReply) => (
              <div
                key={ticketReply.id}
                className={`flex ${ticketReply.by_admin ? "justify-end" : "justify-start"} ${ticketReply.isOptimistic ? "opacity-60" : ""}`}
              >
                <TicketMessage item={ticketReply} />
              </div>
            ))}
          </div>
          <div className="responsive-width fixed bottom-0 right-1/2 z-40 flex w-full translate-x-1/2 flex-col items-center border-t bg-white p-4 md:translate-x-1/4 md:border-none md:bg-transparent">
            <Button
              disabled={ticket?.status === 100}
              title={ticket?.status === 100 ? _STRINGS.TICKET_CLOSED : _STRINGS.ANSWER_MESSAGE}
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
                    maxLength: 5000,
                    rows: 6,
                  }}
                  onChangeText={setMessage}
                  value={message}
                  errors={errors}
                  errorKey="message"
                />
                {errors.message?.[0] ? <p className="text-xs text-danger-500">{errors.message[0]}</p> : null}
                <Button
                  width="w-full"
                  title={_STRINGS.SEND}
                  loading={isReplyPending}
                  disabled={isReplyPending}
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

export default SupportTicket;
