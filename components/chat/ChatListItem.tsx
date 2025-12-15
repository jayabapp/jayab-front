// import { useRouter } from "next/router";
import { ChatListDto } from "@/api_services/chat/chat.interface";
import { useStoreParams } from "@/store";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Link from "next/link";

const ChatListItem = ({ item }: { item: ChatListDto }) => {
  moment.locale("fa", { useGregorianParser: true });
  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  return (
    <Link
      onClick={() => {
        removeredirectRoomToHome();
      }}
      prefetch={false}
      href={`/chat/${item?.uuid}`}
      className="w-full pb-3 relative border-b flex items-start flex-row  gap-2"
    >
      <img
        className="w-12 aspect-square h-12 rounded-10 "
        src={NEW_IMAGE_URL(item?.property_image, "medium")}
        alt={`${item?.property_title}`}
      />

      <div className="flex w-full flex-col gap-2">
        <div className=" w-full flex   flex-col  md:flex-row  items-center justify-between">
          <p className=" font-medium  text-sm   w-full text-start md:w-fit "> {item?.property_title}</p>
          <p className="text-xs opacity-50  w-full text-end hidden md:flex  md:w-fit  ">
            {/* {moment(item?.last_message?.updated_at).utc(true).local().format("hh:mm - jYYYY/jMM/jDD")} */}
            {moment(item?.last_update).format("HH:mm - jYYYY/jMM/jDD")}
          </p>
        </div>
        <p className="text-xs line-clamp-1">{item?.last_message?.text}</p>
        <p className="text-xs opacity-50  w-full text-end flex justify-end md:hidden  md:w-fit  ">
          {/* {moment(item?.last_message?.updated_at).utc(true).local().format("hh:mm - jYYYY/jMM/jDD")} */}
          {moment(item?.last_update).format("HH:mm - jYYYY/jMM/jDD")}
        </p>
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
