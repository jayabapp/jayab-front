import { TicketDatum } from "@/api_services/support/support.interface";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import Link from "next/link";
import React from "react";

const SupportCard = ({ item, type }: { item: TicketDatum; type?: "complain" }) => {
  return (
    <Link
      href={type == "complain" ? `/profile/complains/${item?.id}` : `/profile/support/${item?.id}`}
      className="flex flex-col   bg-white  custome-shadow-card rounded-20 dark:border dark:border-zinc-500 gap-4 p-4 "
    >
      <p className="text-sm md:text-base font-medium">{item?.title}</p>
      <p className="text-justify opacity-80  text-xs md:text-sm leading-6  whitespace-pre-line ">{item?.message}</p>
      <div className="flex items-center justify-between w-full">
        <div
          className={`p-2 bg-gray-1000 dark:bg-zinc-700  text-sm rounded-md ${
            item?.status == 3 ? "text-zinc-500" : item?.status == 1 ? "text-orange-1000" : " text-teal-500"
          }`}
        >
          {item?.status == 3
            ? _STRINGS?.CLOSED
            : item?.status == 1
            ? _STRINGS?.WAITING_TO_RESPOND
            : _STRINGS?.RESPONDED}
        </div>

        <p className="text-xs">{moment(item?.created_at)?.format("jYYYY/jMM/jDD")}</p>
      </div>
      {/* {item?.reply ? (
        <div className="flex border-t border-stone-900/10  pt-4  flex-col  gap-4  ">
          <div className="flex items-center justify-between w-full">
            {" "}
            <p className="text-sm md:text-base font-medium">{item?.reply?.title}</p>{" "}
            <p className="text-xs">{moment(item?.reply?.created_at)?.format("jYYYY/jMM/jDD")}</p>{" "}
          </div>
          <p className="text-justify opacity-80  text-xs md:text-sm leading-6  ">{item?.reply?.message}</p>
        </div>
      ) : (
        <></>
      )} */}
    </Link>
  );
};

export default SupportCard;
