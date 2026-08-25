"use client";

import { useCreateSupportTicket } from "@features/support/hooks/useCreateSupportTicket";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { NewTicketFormProps } from "@/types/features/support/components";

import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

const NewTicketPageComponent = ({ dataKey }: NewTicketFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useCreateSupportTicket(() => {
    router.replace(
      dataKey === "SUGGESTION" ? "/profile/complains" : "/profile/support",
    );
  });

  return (
    <div
      id="homeParent"
      className="profile-container transition-all duration-500 ease-in-out"
    >
      <div className="mt-6 flex flex-col gap-5">
        <FormInput
          item={{
            keyboard: "text",
            title: _STRINGS.TICKET_TITLE,
            containerClass: "w-full",
            titleClass: "",
            inputClass: "!rounded-md",
            autoFocus: false,
          }}
          onChangeText={setTitle}
          value={title}
        />
        <MultiLineFormInput
          item={{
            keyboard: "text",
            title: _STRINGS.TICKET_TEXT,
            containerClass: "w-full",
            titleClass: "",
            rows: 7,
          }}
          onChangeText={setMessage}
          value={message}
        />
        <Button
          loading={isPending}
          title={_STRINGS.SEND_TICKET}
          containerClass="flex w-full items-center justify-end"
          onClick={() => mutate({ message, title, type: dataKey })}
        />
      </div>
    </div>
  );
};

export default NewTicketPageComponent;
