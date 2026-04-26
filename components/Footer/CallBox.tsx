"use client";
import { HomeService } from "@/api_services/home/home.service";
import { useAuthStore } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Editable from "../Editable";
import BtnLoading from "../shared/Button/BtnLoading";
import Button from "../shared/Button/Button";

const CallBox = () => {
  const { isLogin } = useAuthStore((state) => state);
  const { data: footerCallUs, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "footerCallUs"],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "footerCallUs" });
    },
  });

  const onImageError = (e: any) => {
    e.target.src = "/assets/images/home/footer_car.png";
  };

  return (
    <div className=" w-full   p-4 md:px-[10%]  -top-24 absolute">
      <div className=" w-full min-h-[10rem] md:w-full px-6  py-6 md:py-0  gap-6  mx-auto bg-primary-700 rounded-20  relative flex flex-col md:flex-row items-center justify-between">
        <img
          onError={onImageError}
          src={
            !!footerCallUs?.feature_image
              ? NEW_IMAGE_URL(footerCallUs?.feature_image)
              : "/assets/images/footer/footer_place_holder_image.png"
          }
          alt={"footer_image "}
          className=" md:absolute bottom-0   lg:flex  !max-w-[14rem] "
        />
        {isLoading ? (
          <>
            <BtnLoading />{" "}
          </>
        ) : (
          <>
            {" "}
            <Editable
              contentId={footerCallUs?.id}
              className="  flex flex-col md:flex-row justify-between  items-center gap-3 py-4  md:pr-[15rem] "
            >
              <div className="flex flex-col gap-4 ">
                {" "}
                <p className=" font-bold text-white  text-base md:text-xl "> {footerCallUs?.title} </p>
                <p className="  text-sm  text-white "> {footerCallUs?.small_text} </p>
              </div>
              <Link
                href={isLogin ? footerCallUs?.link || "" : `/auth?redirect_url=${footerCallUs?.link}`}
                className="shrink-0"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                {" "}
                <Button
                  color="themeLight"
                  roundedClass="rounded-full"
                  // containerClass="min-w-[10rem]"
                  width="w-fit !px-12 !text-primary-700"
                  title={_STRINGS.BECOME_HOST}
                />
              </Link>
            </Editable>
          </>
        )}
      </div>
    </div>
  );
};

export default CallBox;
