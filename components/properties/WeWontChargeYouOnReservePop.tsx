import { ContentByKeyDto } from "@/api_services/home/home.interface";
import { HomeService } from "@/api_services/home/home.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const WeWontChargeYouOnReservePop = ({ show, onHide }: { onHide: () => void | null; show: boolean }) => {
  const [data, setData] = useState<ContentByKeyDto | null>(null);
  const { data: contentData, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "no-reserve-commission", show],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "no-reserve-commission" });
    },
    enabled: !!show,
  });

  useEffect(() => {
    if (!contentData) return;
    setData(contentData);
  }, [contentData]);

  return (
    <>
      <ModalBottomSheet show={show} onHide={onHide}>
        <div className="flex gap-4  items-center justify-center flex-col p-4  ">
          {isLoading ? (
            <LottieLoading />
          ) : (
            <>
              <img src={NEW_IMAGE_URL(data?.feature_image)} className=" w-60 " />

              <div className="flex flex-col w-full gap-2 items-center justify-center">
                <p className=" font-medium">{data?.small_text}</p>
                <p className="  opacity-65  text-sm whitespace-pre-line text-center  ">{data?.full_text}</p>
              </div>

              <Button
                variant="outline"
                onClick={onHide}
                title={_STRINGS.UNDERSTOOD}
                containerClass="w-full"
                width="w-full"
              />
            </>
          )}
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default WeWontChargeYouOnReservePop;
