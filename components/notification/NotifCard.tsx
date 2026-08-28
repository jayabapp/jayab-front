import type { UserNotification } from "@/types/features/notifications/api";

import moment from "moment-jalaali";

const NotifCard = ({ item }: { item: UserNotification }) => {
  const onClick = () => {};
  return (
    <div
      onClick={onClick}
      className={`  ${
        !!item?.data?.event_id ? "cursor-pointer" : ""
      } py-2 px-3 bg-white/60 rounded-20 custome-shadow-card w-full flex flex-col  items-start justify-between `}
    >
      <div className="flex items-center gap-2 ">
        <img
          src="/assets/icons/header/blue_bell.svg"
          className=" w-4 h-4 md:h-5 md:w-5 aspect-square shrink-0"
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm  text-brand-600">
            {item?.title}
          </p>
          <p className=" text-sm">{item?.body}</p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-end text-brand-600 gap-1">
        <p className="text-xxs md:text-xs text-end w-full">
          {" "}
          {moment(item?.created_at).format("HH:mm")}
        </p>
        <p className="text-xxs  md:text-xs">
          {" "}
          {moment(item?.created_at).format("jYYYY/jMM/jDD")}{" "}
        </p>
      </div>
    </div>
  );
};

export default NotifCard;
