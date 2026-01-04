import { NewSingleChatDto, SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { useChatStore } from "@/store";
import React, { useEffect } from "react";
import BtnLoading from "../shared/Button/BtnLoading";
import LottieLoading from "../shared/Lotties/LottieLoading";
import IsTypingEffect from "./IsTypingEffect";
import MyMessageItem from "./MyMessageItem";
import PrivateOthersMessage from "./PrivateOthersMessage";

const ChatBody = ({
  data,
  firstTime,
  setFirstTime,
  refer,
  scrollToBottom,
  singleChatData,
  isLoading,
  nextIsLoading,
}: {
  data: NewSingleChatDto[];
  firstTime: boolean;
  setFirstTime: (e: boolean) => void | null;
  scrollToBottom: () => void | null;
  refer: React.RefObject<HTMLDivElement | null>;
  singleChatData?: SingleChatDetailsDto;
  isLoading: boolean;
  nextIsLoading: boolean;
}) => {
  // const [firstTime, setFirstTime] = useState(true);
  // const { userInfo } = useSelector((state: any) => state?.init);
  const { isTyping } = useChatStore((state) => state);
  const length = data?.length;

  useEffect(() => {
    if (data?.length > 0 && firstTime && !!singleChatData) {
      scrollToBottom();
      setFirstTime(false);
    }
  }, [data, singleChatData]);

  return (
    <div className="flex pb-4 md:mb-0   flex-1  overflow-y-hidden  items-end w-full  px-4">
      <div className="grid h-fit max-h-[90dvh] gap-6 pt-24 md:pt-36 pb-4  w-full overflow-y-scroll  items-end justify-center grid-cols-3">
        {!!nextIsLoading ? (
          <div className=" flex items-center justify-center w-full col-span-full">
            <BtnLoading />
          </div>
        ) : (
          <></>
        )}
        <div id="getNext" className="w-full  "></div>
        {!!isLoading || !singleChatData ? (
          <div className="col-span-full">
            {" "}
            <LottieLoading />
          </div>
        ) : (
          data?.map((e, index) => {
            if (singleChatData?.self?.participant_id == e?.participant_id) {
              return (
                <MyMessageItem data={e} index={index} length={length} key={`${e?.text}${e?.id}${e?.participant_id}`} />
              );
            } else
              return (
                <PrivateOthersMessage
                  data={e}
                  index={index}
                  length={length}
                  key={`${e?.text}${e?.id}${e?.participant_id}`}
                />
              );
          })
        )}
        {isTyping?.chatroom_id == singleChatData?.id && isTyping?.is_typing ? (
          <div className="col-span-4 w-[100%]  relative  flex justify-end">
            <IsTypingEffect />{" "}
          </div>
        ) : (
          <></>
        )}
        <div
          id="referer"
          key={"referer"}
          ref={refer}
          className={`col-span-full h-12 md:!mt-12  bg-transparent dark:bg-dark-800 transition-all duration-300 ease-in-out`}
        ></div>
      </div>
    </div>
  );
};

export default ChatBody;
