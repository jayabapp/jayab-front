"use client";

import React, { useState } from "react";
import _STRINGS from "@/utils/LocalStrings";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Button from "../shared/Button/Button";
import FormInput from "../shared/Form/FormInput";
import { SupportService } from "@/api_services/support/support.service";
import MultiLineFormInput from "../shared/Form/MultiLineFormInput";
const NewTicketPageComponent = ({ dataKey }: { dataKey: "SUGGESTION" | "TICKET" }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setmessage] = useState("");
  const [issue, setIssue] = useState<{ [key: string]: any }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: SupportService.AddTicket,
    onSuccess: () => {
      if (dataKey == "SUGGESTION") router.replace("/profile/complains");
      else {
        router.replace("/profile/support");
      }
    },
  });

  return (
    <div id="homeParent" className=" profile-container   transition-all duration-500 ease-in-out ">
      <div className="flex mt-6 flex-col gap-5">
        <FormInput
          item={{
            keyboard: "text",

            title: _STRINGS.TICKET_TITLE,
            containerClass: "w-full ",
            titleClass: "",
            inputClass: "!rounded-md  ",
            autoFocus: false,
          }}
          onChangeText={(v: string) => {
            setTitle(v);
          }}
          value={title}
        />{" "}
        {/* <TitleAnimatedFormSelect
            title={_STRINGS?.C76}
            item={{ placeholder: _STRINGS?.C76 }}
            value={issue}
            parentClass="w-full my-2"
            onSelect={(e) => setIssue(e)}
            list={formSelectList}
          /> */}
        <MultiLineFormInput
          item={{
            keyboard: "text",

            title: _STRINGS.TICKET_TEXT,
            containerClass: "w-full  ",

            titleClass: "",
            rows: 7,
          }}
          onChangeText={(v: string) => {
            setmessage(v);
          }}
          value={message}
        />
        <Button
          containerClass="w-full flex items-center justify-end"
          loading={isPending}
          onClick={() => {
            mutate({ message, title });
          }}
          title={_STRINGS?.SEND_TICKET}
        />
      </div>
    </div>
  );
};

export default NewTicketPageComponent;
