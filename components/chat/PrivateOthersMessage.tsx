import { useEffect, useState } from "react";

import { NewSingleChatDto } from "@/api_services/chat/chat.interface";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import { useRef } from "react";
import FullscreenImage from "../uploader/FullScreenImage";
import ChatItemMoreOptions from "./ChatItemMoreOptions";
type itemType = {
  data: NewSingleChatDto;
  index: number;
  length: number;
};
moment.loadPersian();
const PrivateOthersMessage = ({ data, index, length }: itemType) => {
  const refer = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (!refer?.current?.contains(event.target)) {
        setShow(false);
      }
    };

    window.addEventListener("mousedown", handleOutSideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick);
    };
  }, [refer]);

  const close = () => {
    setShow(false);
  };

  const removeEmojis = (string: string) => {
    const regex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g; // eslint-disable-line

    return string?.replace(regex, "");
  };
  const isEmojisOnly = (string: string) => removeEmojis(string)?.length === 0;

  return (
    <div id={data?.id} className={`col-span-4 w-[100%]   relative  flex justify-end `}>
      <div
        onClick={() => {
          setShow(true);
        }}
        className={`  ${`my-anchor-element${data?.id}`}   select-none bg-white dark:bg-dark-700 w-[70%] md:w-[40%] h-fit bg-white-200 ${
          data?.media ? "p-1" : "p-4  pb-2"
        } rounded-xl rounded-bl-none    ${show ? "!bg-primary-50/30 " : ""}  ${data?.media ? "pt-3" : ""} `}
      >
        {/* <img className="absolute top-[-3px]   dark:hidden left-[-6px]" src="/assets/icons/chat/Polygon-white.svg" /> */}

        {/* <div className="bg-white dark:hidden  absolute top-0 left-0 w-6 aspect-square"></div> */}
        {data?.media ? (
          <div
            className={`flex items-center bg-white  dark:bg-dark-700 gap-4 ${
              !!data?.text ? " mb-4" : ""
            } rounded-[10px] `}
          >
            <img
              src={NEW_IMAGE_URL(data?.media)}
              onClick={(e) => {
                e?.stopPropagation();
                setShowFullImage(true);
                e?.preventDefault();
              }}
              className="rounded-md object-cover w-full aspect-square"
            />
            {/* <div className="flex flex-col items-center gap-2 justify-between">
              <p className="text-xs font-medium">{data?.post?.title}</p>
              <p className="text-xs">
                {_STRINGS?.A17} {data?.post?.id}
              </p>
            </div> */}
          </div>
        ) : (
          <></>
        )}
        <p
          className={` ${
            isEmojisOnly(data?.text) ? "text-2xl " : " text-xs md:text-sm"
          } dark:text-gray-100  font-medium  whitespace-pre-line ${!data?.media && !data?.text ? "opacity-60" : ""}`}
        >
          {!data?.media && !data?.text ? _STRINGS.DELETED_MESSAGE : data?.text}
        </p>
        <div className="w-full  mt-2 flex items-center justify-end gap-1">
          <p className="text-xxs opacity-75">{moment(data?.created_at).format(" HH:mm  - jYYYY/jMM/jDD")}</p>
        </div>
      </div>
      {show && <ChatItemMoreOptions close={close} data={data} refer={refer} show={show} />}
      {data?.media ? (
        <FullscreenImage setShow={setShowFullImage} show={showFullImage} src={NEW_IMAGE_URL(data?.media)} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PrivateOthersMessage;
