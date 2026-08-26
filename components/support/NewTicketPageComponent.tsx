"use client";

import { useCreateSupportTicket } from "@features/support/hooks/useCreateSupportTicket";
import { type SupportFormErrors } from "@features/support/model/support.schema";
import { getSupportFormErrors } from "@features/support/model/support.schema";
import { supportTicketSchema } from "@features/support/model/support.schema";
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
  const [errors, setErrors] = useState<SupportFormErrors>({});
  const { mutate, isPending } = useCreateSupportTicket(() => {
    router.replace(
      dataKey === "SUGGESTION" ? "/profile/complains" : "/profile/support",
    );
  });

  const submit = () => {
    try {
      const input = supportTicketSchema.validateSync(
        { message, title },
        { abortEarly: false, stripUnknown: true },
      );
      setErrors({});
      mutate({ ...input, type: dataKey });
    } catch (error) {
      setErrors(getSupportFormErrors(error));
    }
  };

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
          errors={errors}
          errorKey="title"
        />
        {errors.title?.[0] ? (
          <p className="text-xs text-red-600">{errors.title[0]}</p>
        ) : null}
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
          errors={errors}
          errorKey="message"
        />
        {errors.message?.[0] ? (
          <p className="text-xs text-red-600">{errors.message[0]}</p>
        ) : null}
        <Button
          onClick={submit}
          loading={isPending}
          disabled={isPending}
          title={_STRINGS.SEND_TICKET}
          containerClass="flex w-full items-center justify-end"
        />
      </div>
    </div>
  );
};

export default NewTicketPageComponent;
