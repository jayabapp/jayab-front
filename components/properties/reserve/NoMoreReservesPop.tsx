import { HomeService } from "@/api_services/home/home.service";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const NoMoreReservesPop = ({ show, onHide }: { onHide: () => void | null; show: boolean }) => {
  const { data: maxReserveContent, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "max-reserve-content", show],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "max-reserve-content" });
    },
    enabled: !!show,
  });
  return (
    <>
      <ModalBottomSheet show={show} onHide={onHide}>
        <div className="flex gap-4  items-center justify-center flex-col p-4  ">
          {isLoading ? (
            <LottieLoading />
          ) : (
            <>
              <img src={NEW_IMAGE_URL(maxReserveContent?.feature_image)} className=" w-60 " />

              <div className="flex flex-col w-full gap-2 items-center justify-center">
                <p className=" font-medium">{maxReserveContent?.small_text}</p>
                <p className="  opacity-65  text-sm whitespace-pre-line text-center  ">
                  {maxReserveContent?.full_text}
                </p>
              </div>

              <Link href={"/profile/reserves"} className=" w-full" title={"مشاهده رزرو های فعال"} prefetch={false}>
                <Button variant="outline" title={"مشاهده رزرو های فعال"} containerClass="w-full" width="w-full" />
              </Link>
            </>
          )}
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default NoMoreReservesPop;
