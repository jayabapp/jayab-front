import React, { Fragment, useEffect, useState } from "react";

import { useRef } from "react";
import _STRINGS from "@/utils/LocalStrings";
import { NewSingleChatDto, SingleChatDto } from "@/api_services/chat/chat.interface";
import moment from "moment-jalaali";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Notify from "../shared/Toast";
import ChatItemMoreOptions from "./ChatItemMoreOptions";
import FullscreenImage from "../uploader/FullScreenImage";

type itemType = {
  data: NewSingleChatDto;
  index: number;
  length: number;
};

const MyMessageItem = ({ data, index, length }: itemType) => {
  const refer = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    const handleOutSideClick = (event: any) => {
      if (!refer.current?.contains(event.target)) {
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
    <div className={`col-span-4 w-[100%]   relative   `}>
      <div
        onClick={() => {
          setShow(true);
        }}
        className={` ${`my-anchor-element${data?.id}`}  ${
          show ? "bg-primary-50/30 " : ""
        }  w-[70%] md:w-[40%]  cursor-pointer text-black relative bg-[#d7f4be] dark:bg-gray-700 z-1 ${
          data?.media ? "p-1" : "p-4"
        }   rounded-xl   rounded-br-none h-fit`}
      >
        {!!data?.media ? (
          <div
            className={`flex items-center   bg-transparent gap-4 ${
              !!data?.text ? " mb-4" : ""
            }  bg-white rounded-[10px] relative`}
          >
            <img
              src={NEW_IMAGE_URL(data?.media)}
              onClick={(e) => {
                e?.stopPropagation();

                e?.preventDefault();
                setShowFullImage(true);
              }}
              className="rounded-md object-cover  aspect-square"
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
          } whitespace-pre-line dark:text-gray-100  ${!data?.media && !data?.text ? "opacity-60" : ""}  font-medium`}
        >
          {!data?.media && !data?.text ? _STRINGS.DELETED_MESSAGE : data?.text}
        </p>
        <div className="w-full absolute left-4 bottom-1 flex items-center justify-end gap-1">
          {/* {data?.seen ? (
          <img src="/assets/icons/chat/double-tick.svg" className="brightness-200" />
        ) : (
          <img src="/assets/icons/chat/tick.svg" />
        )} */}
          {/* <p className="text-xxs md:text-xs">{moment(data?.created_at).format(" hh:mm  - jYYYY/jMM/jDD")}</p> */}
        </div>
      </div>
      {show && (
        <ChatItemMoreOptions
          mine={!data?.media && !data?.text ? false : true}
          close={close}
          data={data}
          refer={refer}
          show={show}
        />
      )}
      {data?.media ? (
        <FullscreenImage setShow={setShowFullImage} show={showFullImage} src={NEW_IMAGE_URL(data?.media)} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyMessageItem;
