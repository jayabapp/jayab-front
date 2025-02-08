import React from "react";
// import { useRouter } from "next/router";
import _STRINGS from "@/utils/LocalStrings";
import { ChatListDto, Profile } from "@/api_services/chat/chat.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import { ImageDto } from "@/api_services/auth/auth.interface";
import Link from "next/link";

const ChatListItem = ({ item }: { item: ChatListDto }) => {
  moment.locale("fa", { useGregorianParser: true });
  return (
    <Link
      prefetch={false}
      href={`/chat/${item?.uuid}`}
      className="w-full pb-3 relative border-b flex items-center flex-row  gap-2"
    >
      <img
        className="w-12 aspect-square h-12 rounded-10 "
        src={NEW_IMAGE_URL(item?.property_image, "medium")}
        alt={`${item?.property_title}`}
      />

      <div className="flex w-full flex-col gap-2">
        <div className=" w-full flex items-center justify-between">
          <p className=" font-medium  text-sm "> {item?.property_title}</p>
          <p className="text-xs opacity-50  ">
            {moment(`${item?.last_message?.updated_at}Z`).format("hh:mm - jYYYY/jMM/jDD")}
            {/* {moment().format("hh:mm - jYYYY/jMM/jDD")} */}
          </p>
        </div>
        <p className="text-xs line-clamp-1">{item?.last_message?.text}</p>
      </div>
      {!!item?.unread_count && item?.unread_count != "0" ? (
        <div className="rounded-full absolute left-0 bottom-2  flex items-center justify-center w-5 h-5 aspect-square text-sm bg-primary-700 text-white transition-all duration-200 ease-in-out">
          {item?.unread_count}
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default ChatListItem;
