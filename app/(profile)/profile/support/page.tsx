"use client";

import _STRINGS from "@/utils/LocalStrings";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import InfiniteScroll from "react-infinite-scroll-component";
import BtnLoading from "@/components/shared/Button/BtnLoading";

import Button from "@/components/shared/Button/Button";
import { SupportService } from "@/api_services/support/support.service";
import { TicketDatum } from "@/api_services/support/support.interface";
import { Meta } from "@/api_services/chat/chat.interface";
import Breadcrumbs from "@/components/BreadCrumbs";
import { isEmpty } from "lodash";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import SupportCard from "@/components/support/SupportCard";

const Support = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<TicketDatum[]>([]);
  const [meta, setMeta] = useState<Meta>();

  const { data: solidData, isLoading } = useQuery({
    queryKey: [SupportService?.TICKETS_CACHEKEY, page],
    queryFn: () => SupportService?.GetTickets({ page: page }),
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (!!solidData) {
      if (solidData?.data) setTickets((x) => [...x, ...solidData?.data]);
      if (solidData?.meta) setMeta(solidData?.meta);
    }
  }, [solidData]);

  return (
    <div id="homeParent" className=" profile-container flex flex-col gap-4   transition-all duration-500 ease-in-out ">
      {/* <Breadcrumbs /> */}
      {isLoading && isEmpty(tickets) ? (
        <LottieLoading />
      ) : tickets?.length == 0 ? (
        <EmptyList />
      ) : (
        <InfiniteScroll
          dataLength={tickets?.length} //This is important field to render the next data
          next={() => setPage((e) => e + 1)}
          hasMore={page !== meta?.lastPage ? true : false}
          className="grid  grid-cols-1 md:grid-cols-2  gap-4  p-4"
          loader={
            <div className="w-full mt-8   flex items-center justify-center md:p-4">
              <BtnLoading />
            </div>
          }
        >
          {tickets?.map((e) => (
            <SupportCard item={e} key={`${e?.id}tickets`} />
          ))}
        </InfiniteScroll>
      )}

      <Button
        variant="outline"
        width="!font-bold !bg-white"
        containerClass="flex items-center justify-start"
        title={_STRINGS?.SEND_NEW_TICKET}
        onClick={() => {
          router?.push("/profile/support/new-ticket");
        }}
      />
    </div>
  );
};

export default Support;
