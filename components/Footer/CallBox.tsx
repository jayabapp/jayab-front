"use client";

import { NEW_IMAGE_URL } from "@/utils/urls";
import { useAuthStore } from "@/store";
import { ImageFallback } from "@/components/elements/Image";

import useCmsContent from "@/hooks/useCmsContent";
import { BtnLoading } from "@elements/Button";
import Editable from "../Editable";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "../shared/CmsText";
import Button from "@elements/Button";
import Link from "next/link";

const CallBox = () => {
  const { isLogin } = useAuthStore((state) => state);
  const { content: footerCallUs, isLoading } = useCmsContent("footerCallUs");

  return (
    <div className=" w-full   p-4 md:px-[10%]  -top-24 absolute">
      <div className=" w-full min-h-[10rem] md:w-full px-6  py-6 md:py-0  gap-6  mx-auto bg-brand-600 rounded-20  relative flex flex-col md:flex-row items-center justify-between">
        <ImageFallback
          src={
            !!footerCallUs?.feature_image
              ? NEW_IMAGE_URL(footerCallUs?.feature_image)
              : "/assets/images/footer/footer_place_holder_image.png"
          }
          fallbackSrc="/assets/images/home/footer_car.png"
          width={512}
          height={384}
          sizes="224px"
          alt={"footer_image "}
          className="md:absolute bottom-0 lg:flex !max-w-[14rem] h-auto"
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
                <p className=" font-bold text-white  text-base md:text-xl ">
                  {" "}
                  {footerCallUs?.title}{" "}
                </p>
                <CmsText whitespace="normal" className="  text-sm  text-white ">
                  {footerCallUs?.small_text}
                </CmsText>
              </div>
              <Link
                title={_STRINGS.BECOME_HOST}
                href={
                  isLogin
                    ? footerCallUs?.link || ""
                    : `/auth?redirect_url=${footerCallUs?.link}`
                }
                className="shrink-0"
                target="_blank"
                referrerPolicy="no-referrer"
              >
                {" "}
                <Button
                  color="themeLight"
                  roundedClass="rounded-full"
                  title={_STRINGS.BECOME_HOST}
                  width="w-fit !px-12 !text-brand-600"
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
