import React, { useEffect, useRef, useState } from "react";
import MyMessageItem from "./MyMessageItem";
import PrivateOthersMessage from "./PrivateOthersMessage";
import { NewSingleChatDto, SingleChatDetailsDto, SingleChatDto } from "@/api_services/chat/chat.interface";
import IsTypingEffect from "./IsTypingEffect";
import { useChatStore } from "@/store";

const ChatBody = ({
  data,
  firstTime,
  setFirstTime,
  refer,
  scrollToBottom,
  singleChatData,
}: {
  data: NewSingleChatDto[];
  firstTime: boolean;
  setFirstTime: (e: boolean) => void | null;
  scrollToBottom: () => void | null;
  refer: React.RefObject<HTMLDivElement | null>;
  singleChatData?: SingleChatDetailsDto;
}) => {
  // const [firstTime, setFirstTime] = useState(true);
  // const { userInfo } = useSelector((state: any) => state?.init);
  const { isTyping } = useChatStore((state) => state);
  const length = data?.length;

  useEffect(() => {
    if (data?.length > 0 && firstTime) {
      scrollToBottom();
      setFirstTime(false);
    }
  }, [data]);

  return (
    <div className="flex pb-4 md:mb-0   overflow-y-hidden  items-end w-full  px-4">
      <div className="grid h-fit max-h-[90dvh] gap-6 pt-24 md:pt-36 pb-4  w-full overflow-y-scroll  items-end justify-center grid-cols-3">
        {data?.map((e, index) => {
          if (singleChatData?.self?.participant_id == e?.participant_id) {
            return <MyMessageItem data={e} index={index} length={length} key={`${e?.text}${e?.id}`} />;
          } else return <PrivateOthersMessage data={e} index={index} length={length} key={`${e?.text}${e?.id}`} />;
        })}
        {isTyping?.chatroom_id == singleChatData?.id && isTyping?.is_typing ? (
          <div className="col-span-4 w-[100%]  relative  flex justify-end">
            <IsTypingEffect />{" "}
          </div>
        ) : (
          <></>
        )}
        <div
          key={"referer"}
          ref={refer}
          className={`col-span-3 h-12 md:!mt-12  bg-neutral-100 dark:bg-dark-800 transition-all duration-300 ease-in-out`}
        ></div>
      </div>
    </div>
  );
};

export default ChatBody;
