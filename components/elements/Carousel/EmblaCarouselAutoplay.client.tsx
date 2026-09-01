"use client";

import type { CarouselAutoplayState } from "@/types/components/elements/carousel";
import { useCallback, useEffect, useState } from "react";

export const useAutoplay = (emblaApi: any | undefined): CarouselAutoplayState => {
  const [autoplayIsPlaying, setAutoplayIsPlaying] = useState(false);

  const onAutoplayButtonClick = useCallback(
    (callback: () => void) => {
      const autoplay: any = emblaApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop: any = autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;

      resetOrStop();
      callback();
    },
    [emblaApi]
  );

  const toggleAutoplay = useCallback(() => {
    const autoplay: any = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [emblaApi]);

  useEffect(() => {
    const autoplay: any = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const handlePlay = () => setAutoplayIsPlaying(true);
    const handleStop = () => setAutoplayIsPlaying(false);
    const handleReInit = () => setAutoplayIsPlaying(autoplay.isPlaying());
    const animationFrame = requestAnimationFrame(handleReInit);
    emblaApi
      .on("autoplay:play", handlePlay)
      .on("autoplay:stop", handleStop)
      .on("reInit", handleReInit);

    return () => {
      cancelAnimationFrame(animationFrame);
      emblaApi.off("autoplay:play", handlePlay).off("autoplay:stop", handleStop).off("reInit", handleReInit);
    };
  }, [emblaApi]);

  return {
    autoplayIsPlaying,
    toggleAutoplay,
    onAutoplayButtonClick,
  };
};
