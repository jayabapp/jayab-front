"use client";

import { Keyboard, Pagination, Zoom } from "swiper/modules";
import { ContentImage } from "@elements/Image";
import { useDir } from "@hooks/useDir";
import { Swiper } from "swiper/react";
import { useState } from "react";

import "swiper/css/pagination";
import "swiper/css/zoom";
import "swiper/css";

const SwiperWithNavigation = ({
  children,
  reference,
  dataLength,
  containerClass,
  ...props
}: any) => {
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setisStart] = useState(
    !props?.initialSlide || props?.initialSlide == 0,
  );
  const [slidesPerView, setslidesPerView] = useState<number | string>(2);
  const rtl = useDir() === "rtl";
  const canScroll = dataLength > slidesPerView;
  const showLeft = canScroll && (rtl ? !isEnd : !isStart);
  const showRight = canScroll && (rtl ? !isStart : !isEnd);
  const goForward = () => {
    reference.current?.slideNext();
    setisStart(false);
  };
  const goBack = () => {
    reference.current?.slidePrev();
    setIsEnd(false);
  };

  return (
    <div
      className={`w-full  flex items-center !select-none  ${containerClass}`}
    >
      {showLeft ? (
        <div
          onClick={rtl ? goForward : goBack}
          className=" my-auto    flex bottom-0 top-0  items-center justify-center hover:scale-102 group hover:bg-action  transition-all lg:flex md:flex-col absolute z-10 bg-surface/40   rounded-full cursor-pointer h-10 w-10 left-4   right-auto"
        >
          <ContentImage
            width={18}
            height={18}
            alt="chvronSwiper"
            src="/assets/icons/shared/chevron.svg"
            className="w-[1.125rem] h-[1.125rem]  rotate-90   select-none group-hover:invert"
          />
        </div>
      ) : null}

      <Swiper
        zoom={true}
        keyboard={true}
        modules={[Keyboard, Zoom, Pagination]}
        onReachBeginning={() => {
          setisStart(true);
          setIsEnd(false);
        }}
        onSlideNextTransitionStart={() => setisStart(false)}
        onSlidePrevTransitionStart={() => setIsEnd(false)}
        onAfterInit={(swiper) =>
          setslidesPerView(swiper?.params?.slidesPerView || 2)
        }
        ref={reference}
        onReachEnd={() => {
          setIsEnd(true);
          setisStart(false);
        }}
        {...props}
      >
        {children}
      </Swiper>

      {showRight ? (
        <div
          onClick={rtl ? goBack : goForward}
          className="flex bottom-0 top-0 my-auto hover:scale-102 transition-all group hover:bg-action lg:flex md:flex-col absolute z-10 bg-surface/40   rounded-full cursor-pointer h-10 w-10 right-4  left-auto justify-center items-center"
        >
          <ContentImage
            width={18}
            height={18}
            alt="chvronSwiper"
            src="/assets/icons/shared/chevron.svg"
            className="w-[1.125rem] -rotate-90 h-[1.125rem] select-none group-hover:invert"
          />
        </div>
      ) : null}
    </div>
  );
};

export default SwiperWithNavigation;
