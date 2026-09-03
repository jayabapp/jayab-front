import { resolveChatImage } from "@features/chat/presentation/chat.presenter";
import type { ChatListItemProps } from "@/types/components/modules/chat";
import { ContentImage } from "@elements/Image";
import { useStoreParams } from "@/store";

import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";

const ChatListItem = ({ item, onClickCb }: ChatListItemProps) => {
  moment.locale("fa", { useGregorianParser: true });
  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  return (
    <Link
      title={item?.property_title}
      onClick={() => {
        removeredirectRoomToHome();
        onClickCb?.();
      }}
      href={`/chat/${item?.uuid}`}
      className="w-full flex  relative pb-3  border-b flex-col"
    >
      <div className="w-full  relative  flex items-start flex-row  gap-2">
        <ContentImage
          width={48}
          height={48}
          alt={`${item?.property_title}`}
          className="w-12 aspect-square h-12 rounded-md "
          src={resolveChatImage(item?.property_image, "medium")}
        />
        <div className=" w-full flex   flex-col   items-start gap-2 justify-between">
          <p className=" font-medium  text-sm   w-full text-start md:w-fit ">
            {" "}
            {item?.property_title}
          </p>
          <div className="w-full flex items-center gap-0.5 ">
            <Image
              alt="کاربر"
              width={20}
              height={20}
              className="w-5 h-5"
              src="/assets/icons/chat/basil_user.svg"
            />
            <p className="text-xs !leading-2 opacity-50 mt-1 ">
              {item?.other_side_mobile}
            </p>
          </div>
        </div>
      </div>

      <div className="flex relative w-full flex-col gap-2 pr-14  mt-2  ">
        <div className=" w-full flex   flex-row  items-center gap-2 justify-between">
          <div className="   rounded-md w-full p-1">
            <p className="text-xs line-clamp-1">{item?.last_message?.text}</p>
          </div>
          {!!item?.last_update && moment(item?.last_update).isValid() ? (
            <p className="text-xs opacity-50   shrink-0 text-end flex justify-end w-fit  ">
              {moment(item?.last_update).format("HH:mm - jYYYY/jMM/jDD")}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
      {!!item?.unread_count && item?.unread_count != "0" ? (
        <div className="rounded-full absolute left-0 top-2  flex items-center justify-center w-5 h-5 aspect-square text-sm bg-brand-600 text-white transition-all duration-200 ease-in-out">
          {item?.unread_count}
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default ChatListItem;
