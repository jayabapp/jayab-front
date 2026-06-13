import { HomeService } from "@/api_services/home/home.service";
import { ReserveListDto } from "@/api_services/reserve/reserve.interface";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import Button from "@/components/shared/Button/Button";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdExpiredPop = ({ show, onHide, data }: { onHide: () => void | null; show: boolean; data: ReserveListDto }) => {
  const pathname = usePathname();

  const { data: maxReserveContent, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "ad-expired-content", show],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "ad-expired-content" });
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

              <Link
                title={"تمدید اعتبار"}
                href={`/profile/owner/properties/${data?.property?.id}/subscription?GATE_WAY_REDIRECT_URL=${pathname}`}
                className=" w-full"
                prefetch={false}
              >
                <Button variant="outline" title={"تمدید اعتبار"} containerClass="w-full" width="w-full" />
              </Link>
            </>
          )}
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default AdExpiredPop;
