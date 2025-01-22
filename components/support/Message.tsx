import React from "react";
import moment from "moment-jalaali";
import _STRINGS from "@/utils/LocalStrings";

type MessageProps = {
  item: any;
};

const Message: React.FC<MessageProps> = ({ item }) => {
  return (
    <div
      className={`w-full  rounded-lg p-4 text-white ${
        !!item?.by_admin
          ? "bg-primary-700/75 dark:bg-zinc-700 dark:border dark:border-zinc-300 "
          : "bg-zinc-200   dark:bg-zinc-800  !text-zinc-500 dark:text-zinc-200"
      } `}
    >
      {item?.by_admin ? <p className="text-sm text-gray-300 pb-2">{_STRINGS.B46}</p> : <></>}
      <div className="flex items-center gap-2">
        <p className={` ${item?.by_admin ? " " : "text-zinc-500 dark:text-zinc-200"} font-light text-sm`}>
          {moment(item?.created_at).format(" HH:mm  ")}
        </p>
        <p className={` ${item?.by_admin ? "" : "text-zinc-500 dark:text-zinc-200"} font-light text-sm`}>
          {moment(item?.created_at).format("jYYYY/jMM/jDD  ")}
        </p>
      </div>
      <div
        className={`  ${
          item?.by_admin ? "dark:text-zinc-200" : "text-zinc-500 dark:text-zinc-200"
        } flex flex-col gap-y-2`}
      >
        <p className="font-bold flex max-w-[50%] line-clamp-1 ">{item?.title}</p>
        <p className="whitespace-pre-line ">{item?.message}</p>
      </div>
    </div>
  );
};

export default Message;
