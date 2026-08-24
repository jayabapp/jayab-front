import { ContentDto } from "@/api_services/home/home.interface";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";
import Editable from "../Editable";

moment.loadPersian();
const LatestBlogCard = ({ item }: { item: ContentDto }) => {
  return (
    <Editable
      contentId={item?.id}
      containerClass={"h-full"}
      className={`  !h-full  overflow-clip aspect-auto  rounded-20 shadow-card  justify-between  hover:scale-98   bg-white   relative cursor-pointer transition-all duration-200 ease-in-out group    flex items-center  flex-col gap-1   `}
    >
      <Link href={`/blog/${item?.slug}`} title={item?.title} className="flex flex-col w-full">
        {" "}
        <div className="  w-full   aspect-[2] relative">
          <Image
            src={NEW_IMAGE_URL(item?.feature_image, "medium")}
            fill
            sizes="(min-width: 1536px) 26vw, (min-width: 768px) 30vw, 92vw"
            className=" object-cover  aspect-[2] "
            alt={item?.feature_image?.alt || item?.title}
          />
        </div>
      </Link>
      <Link
        title={item?.small_text || item?.full_text || ""}
        href={`/blog/${item?.slug}`}
        className=" gap-2 flex p-3 flex-col items-start w-full justify-center "
      >
        <div className="w-full    font-normal  z-1 ">{moment(item?.created_at).format("jYYYY/jMM/jDD")}</div>
        <p className=" font-bold line-clamp-1 ">{item?.title}</p>
        <p className="line-clamp-2  whitespace-pre-wrap flex-1 min-h-[2.5rem] text-base">
          {item?.small_text || item?.full_text || ""}
        </p>
      </Link>
      <div className="w-full  pb-4">
        {" "}
        <Link title={_STRINGS?.WATCH} href={`/blog/${item?.slug}`} className=" ">
          {" "}
          <Button
            title={_STRINGS?.WATCH}
            roundedClass="rounded-full "
            containerClass="mb-1 flex  items-center  justify-center !w-full  !text-sm "
            // variant="white"
            width="!px-8 !py-1 !min-w-[40%]    !font-normal "
          />
        </Link>
      </div>
    </Editable>
  );
};

export default LatestBlogCard;
