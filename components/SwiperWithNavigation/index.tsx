import React, { useState } from "react";
import SwiperCore from "swiper";
import { Keyboard, Pagination, Zoom } from "swiper/modules";
import "swiper/css/zoom";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
// import ChevronArrow from "../DynamicIcons/ChevronArrow";
SwiperCore.use([Keyboard]);
function SwiperWithNavigation({ dataLength, children, reference, containerClass, ...props }: any) {
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setisStart] = useState(!props?.initialSlide || props?.initialSlide == 0);
  const [slidesPerView, setslidesPerView] = useState<number | string>(2);

  return (
    <div className={`w-full  flex items-center !select-none  ${containerClass}`}>
      {!isEnd && dataLength > slidesPerView ? (
        <div
          onClick={() => {
            reference.current?.slideNext();
            setisStart(false);
          }}
          className=" my-auto    flex bottom-0 top-0  items-center justify-center hover:scale-102 group hover:bg-primary-700 dark:hover:bg-primary-700 transition-all lg:flex md:flex-col absolute z-10 bg-white/40 dark:bg-zinc-800  rounded-full cursor-pointer h-10 w-10 left-4   right-auto  bg-gray-250  "
        >
          <img
            src="/assets/icons/shared/chevron.svg"
            className="w-6 h-6  rotate-90 dark:opacity-50 dark:invert select-none group-hover:invert"
            alt="chvronSwiper"
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
        onSlideNextTransitionStart={() => {
          setisStart(false);
        }}
        onSlidePrevTransitionStart={() => {
          setIsEnd(false);
        }}
        onAfterInit={(swiper) => setslidesPerView(swiper?.params?.slidesPerView || 2)}
        // onSliderFirstMove={() => {
        //   setisStart(false);
        //   setIsEnd(false);
        // }}
        ref={reference}
        onReachEnd={() => {
          setIsEnd(true);
          setisStart(false);
        }}
        {...props}
      >
        {children}
      </Swiper>

      {!isStart && dataLength > slidesPerView ? (
        <div
          onClick={() => {
            reference.current?.slidePrev();
            setIsEnd(false);
          }}
          className=" flex   bottom-0 top-0  my-auto hover:scale-102 transition-all group hover:bg-primary-700 dark:hover:bg-primary-700  lg:flex md:flex-col absolute z-10 bg-white/40 dark:bg-zinc-800  rounded-full cursor-pointer h-10 w-10 right-4  left-auto  bg-gray-250  justify-center items-center"
        >
          <img
            src="/assets/icons/shared/chevron.svg"
            className="w-6 -rotate-90 h-6 dark:opacity-50 dark:invert  select-none group-hover:invert "
            alt="chvronSwiper"
          />
        </div>
      ) : null}
    </div>
  );
}

export default SwiperWithNavigation;
