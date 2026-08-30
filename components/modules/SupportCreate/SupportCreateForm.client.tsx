"use client";

import { useCreateSupportTicket } from "@features/support/hooks/useCreateSupportTicket";
import { type SupportFormErrors } from "@features/support/model/support.schema";
import type { NewTicketFormProps } from "@/types/features/support/components";
import { getSupportFormErrors } from "@features/support/model/support.schema";
import { supportTicketSchema } from "@features/support/model/support.schema";
import { MultiLineFormInput } from "@elements/Form";
import { useRouter } from "next/navigation";
import { FormInput } from "@elements/Form";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const SupportCreateForm = ({ dataKey }: NewTicketFormProps) => {
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
        <p className="text-xs text-danger-500">{errors.title[0]}</p>
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
        <p className="text-xs text-danger-500">{errors.message[0]}</p>
      ) : null}
      <Button
        onClick={submit}
        loading={isPending}
        disabled={isPending}
        title={_STRINGS.SEND_TICKET}
        containerClass="flex w-full items-center justify-end"
      />
    </div>
  );
};

export default SupportCreateForm;
