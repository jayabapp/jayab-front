"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

import FormInput from "@/components/shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import { SupportService } from "@/api_services/support/support.service";
import Breadcrumbs from "@/components/BreadCrumbs";
import MultiLineFormInput from "@/components/shared/Form/MultiLineFormInput";
import Message from "@/components/support/Message";

const TicketsPage = () => {
  const params = useParams();
  const [message, setMessage] = useState<string>("");
  const { data, refetch } = useQuery({
    queryKey: [SupportService?.SINGLE_TICKET_GET_CACHEKEY, params?.id],
    queryFn: () => SupportService.GetSingleTicket({ id: `${params?.id}` }),
    gcTime: 0,
    staleTime: 0,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: SupportService.Reply,
    onSuccess: () => {
      refetch();
    },
  });

  async function handleSubmitMessage() {
    mutate({ message, id: `${params?.id}` });
  }

  return (
    <div
      id="homeParent"
      className=" profile-container flex flex-col gap-4   !pb-80 transition-all duration-500 ease-in-out "
    >
      {/* <Breadcrumbs /> */}

      {data?.status == 2 && (
        <div className=" w-full my-10 pb-6 border-b   p-4   flex flex-col items-center  ">
          <div className="w-full  ">
            <MultiLineFormInput
              item={{
                placeholder: _STRINGS.JUST_MESSAGE,
                maxLength: 1000,
                rows: 6,
              }}
              onChangeText={(v: string) => {
                setMessage(v ?? "");
              }}
              value={message ?? ""}
            />
          </div>

          <Button
            title={_STRINGS.SEND}
            disabled={isPending}
            loading={isPending}
            onClick={() => {
              handleSubmitMessage();
            }}
            containerClass="!w-full flex items-center justify-center md:justify-end"
            width=" w-fit px-20"
            roundedClass="rounded-lg"
          />
        </div>
      )}

      <div className="ticket-details-container  ">
        <div className="ticket-details-content responsive-text  ">
          <div className="">
            <div className="w-full">
              <Message item={data} />
            </div>
            <div className="mt-4 w-full   flex flex-col gap-y-4">
              {data?.replies?.map((e: any) => (
                <div key={e?.id} className={` w-full flex ${!!e?.by_admin ? "justify-end" : "justify-start"} `}>
                  <Message item={e} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
