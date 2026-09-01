import type { ContentQuestionCommentProps } from "@/types/components/modules/blog";

import moment from "moment-jalaali";
import Image from "next/image";

moment.loadPersian();

export const CommentComponent = ({ item }: ContentQuestionCommentProps) => {
  return (
    <div className="w-full flex flex-col ">
      <div className=" w-full flex flex-col  gap-4 p-3  border border-secondary-400 rounded-xl">
        <div className="flex  flex-row items-center justify-between">
          <div className=" flex items-center gap-1 border  border-neutral-200  rounded-full pl-2 p-[1px]  ">
            {" "}
            <Image
              alt=""
              width={24}
              height={24}
              className="w-6 h-6  opacity-60"
              src="/assets/icons/profile/profile_holder.svg"
            />{" "}
            <p className="text-sm  text-secondary-600 ">{item?.author_name}</p>
          </div>
          <div className="  flex  items-center gap-2 ">
            <Image
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 "
              src={"/assets/icons/blogs/calendar.svg"}
            />
            <p className=" text-xs md:text-sm  text-secondary-700 ">
              {moment(item.created_at).format("jDD jMMMM jYYYY")}
            </p>
          </div>
        </div>
        <p className="!font-normal !text-md ">{item?.question}</p>
      </div>
      {!!item?.answer && (
        <div className="w-full mt-4 flex flex-row items-center justify-between gap-4 ">
          <Image
            alt=""
            width={16}
            height={16}
            className="!w-4 shrink-0  aspect-square"
            src="/assets/icons/contents/arrow_curved_up.svg"
          />
          <div className="p-6 w-full flex flex-col gap-4 bg-secondary-200 rounded-10 ">
            <div className="flex flex-row items-center justify-between">
              <div className=" flex items-center gap-1 border  border-neutral-200  rounded-full pl-2 p-[1px]  ">
                <Image
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6  opacity-60"
                  src="/assets/icons/profile/profile_holder.svg"
                />
                <p className="text-sm text-neutral-400 ">پاسخ ادمین</p>
              </div>
              <div className="  flex  items-center gap-2 ">
                <Image
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 "
                  src={"/assets/icons/blogs/calendar.svg"}
                />
                <p className=" text-xs md:text-sm  text-secondary-700 ">
                  {moment(item.updated_at).format("jDD jMMMM jYYYY")}
                </p>
              </div>
            </div>
            <p className=" whitespace-pre-wrap ">{item?.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
