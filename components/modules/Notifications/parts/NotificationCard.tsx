import type { NotificationCardProps } from "@/types/components/modules/profile";
import { ContentImage } from "@elements/Image";

import moment from "moment-jalaali";

const NotificationCard = ({ notification }: NotificationCardProps) => (
  <div className="py-2 px-3 bg-white/60 rounded-20 custome-shadow-card w-full flex flex-col items-start justify-between">
    <div className="flex items-center gap-2">
      <ContentImage
        alt=""
        width={20}
        height={20}
        src="/assets/icons/header/blue_bell.svg"
        className="w-4 h-4 md:h-5 md:w-5 aspect-square shrink-0"
      />
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm text-brand-600">
          {notification?.title}
        </p>
        <p className="text-sm">{notification?.body}</p>
      </div>
    </div>
    <div className="flex flex-row w-full justify-end text-brand-600 gap-1">
      <p className="text-xxs md:text-xs text-end w-full">
        {moment(notification?.created_at).format("HH:mm")}
      </p>
      <p className="text-xxs md:text-xs">
        {moment(notification?.created_at).format("jYYYY/jMM/jDD")}
      </p>
    </div>
  </div>
);

export default NotificationCard;
