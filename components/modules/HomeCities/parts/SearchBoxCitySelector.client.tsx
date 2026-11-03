"use client";

import { Suspense, useEffect, useEffectEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { CityModal } from "@modules/CitySelector";
import { Icon } from "@elements/Icon";

import type { TSearchBoxProps } from "@/types/components/elements/LinearData";

const asIdList = (value: unknown) =>
  Array.isArray(value) && value.length
    ? value.join(",")
    : value && !Array.isArray(value)
      ? String(value)
      : undefined;

const SeachBoxCitySelector = ({
  options,
  onSubmitCB,
  onPickCities,
}: TSearchBoxProps) => {
  const t = useTranslations("search");

  const [showCities, setShowCities] = useState(false);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<Record<string, unknown>>({});
  const isPending = useRef(false);
  const handBack = useEffectEvent(() => {
    if (!isPending.current || !title) return;
    isPending.current = false;
    onPickCities?.({
      title,
      cities: asIdList(picked.cities),
      provinces: asIdList(picked.provinces),
    });
  });
  useEffect(() => handBack(), [picked, title]);
  const onHideCities = () => setShowCities(false);
  const onShowCities = () => setShowCities(true);

  return (
    <div
      className={` px-4 w-full relative flex cursor-pointer items-center shrink-0  ${options?.cotainerClass || ""} `}
    >
      {" "}
      <div
        onClick={onShowCities}
        className={` px-0 pb-0 pt-4 w-full relative flex cursor-pointer items-center shrink-0 gap-2   border-t  `}
      >
        <div className=" rounded-md   bg-surface-muted  size-10  flex items-center  justify-center  border ">
          <ContentImage
            alt=""
            width={20}
            height={20}
            src="/assets/icons/home/home_location.svg"
            className={` size-5 aspect-auto ${!!title ? " text-ink opacity-70 " : "opacity-40"}`}
          />{" "}
        </div>

        <div className="flex flex-col items-start justify-start gap-1 ">
          <p className="text-sm font-bold">{t("cityListTitle")}</p>
          <p className="text-2xs ">{t("cityListHint")}</p>
        </div>

        <Icon
          size={16}
          name="chevron-end"
          className="absolute end-0 size-3 text-ink"
        />
      </div>
      <Suspense>
        <CityModal
          isHome
          show={showCities}
          setTitle={setTitle}
          passedUrl={"/rooms"}
          onHide={onHideCities}
          onSubmitExtendedCB={onPickCities ? undefined : onSubmitCB}
          customeValues={
            onPickCities ? (picked as Record<string, string>) : undefined
          }
          onSubmitCustomeCB={
            onPickCities
              ? (
                  update: (
                    current: Record<string, unknown>,
                  ) => Record<string, unknown>,
                ) => {
                  isPending.current = true;
                  setPicked(update(picked));
                }
              : undefined
          }
        />
      </Suspense>
    </div>
  );
};

export default SeachBoxCitySelector;
