"use client";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import StatusShower from "@/components/shared/StatusShower";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import moment from "moment-jalaali";
import Image from "next/image";
import Link from "next/link";
import LinearTextBlock from "../SinglePropertyAccards/LinearTextBlock";
moment.loadPersian({ dialect: "persian-modern" });

const ReserveCard = ({
  data,
  isOwner,
  setSelectedCancel,
}: {
  data: ReserveListDto;
  isOwner?: boolean;
  setSelectedCancel: (e: ReserveListDto) => void | null;
}) => {
  const goToLink = `/rooms/${data?.property?.slug}`;

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  return (
    <div className="w-full shadow-card  rounded-2xl    justify-between flex flex-col  p-3   gap-2  ">
      <div className="w-full  grid grid-cols-5 gap-2   ">
        {/* INFO */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className="col-span-3  !outline-none order-1  flex flex-col gap-1"
        >
          {/* TITLE */}
          <div className="flex items-start gap-2">
            <p className="text-sm line-clamp-1  text-right font-semibold">{data?.property?.title}</p>
          </div>

          {/* CODE  - LIKES */}
          <div className="flex items-center justify-between gap-4">
            <div className="bg-black/10 font-normal rounded-md text-xs   px-2 py-1  leading-4  flex items-center justify-center">
              کد {data?.property?.code}
            </div>{" "}
          </div>

          <div className="w-full flex mt-2 flex-col  gap-2">
            <LinearTextBlock
              options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
              title={_STRINGS.START_DATE}
              value={` ${moment(data?.check_in).format("ddd - jYYYY/jMM/jD")}`}
            />
            <LinearTextBlock
              title={_STRINGS.EXIT_DATE}
              value={` ${moment(data?.check_out).format("ddd - jYYYY/jMM/jD")}`}
              options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
            />
            <LinearTextBlock
              title={_STRINGS.PPL_COUNT}
              value={data?.guests_count}
              options={{ title_class: " !font-normal !text-sm", value_class: "!text-sm" }}
            />
          </div>
        </Link>{" "}
        {/* IMAGE PART */}
        <Link
          onClick={removeredirectRoomToHome}
          href={`${goToLink}`}
          prefetch={false}
          className=" flex h-fit !outline-none items-start  justify-start w-full col-span-2  order-2 "
        >
          <div className=" aspect-square w-full h-full relative">
            <Image
              fill
              loading="lazy"
              quality={100}
              alt={data?.property?.feature_image?.alt || ""}
              src={
                !!data?.property?.feature_image
                  ? NEW_IMAGE_URL(data?.property?.feature_image, "medium")
                  : "/assets/icons/shared/image_placeholder.svg"
              }
              className=" w-full rounded-10  h-full  object-cover aspect-square"
            />
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-between ">
        <StatusShower data={data?.status} />

        {!isOwner ? (
          <div
            onClick={() => {
              setSelectedCancel(data);
            }}
            className=" cursor-pointer bg-red-100    w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-xxs  md:text-sm font-medium"
          >
            لغو
            <img src="/assets/icons/adds/x_mark.svg" className=" w-2 h-2  md:w-3 cursor-pointer opacity-60 md:h-3" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ReserveCard;
