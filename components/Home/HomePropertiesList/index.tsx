"use client";

import React, { useEffect, useMemo, useState } from "react";
import HomePropertiesSsrPart from "./HomePropertiesSsrPart";
import { chunk, isEmpty, last } from "lodash";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import HomePropertiesClientPart from "./HomePropertiesClientPart";

const HomePropertiesList = ({ data, middleBanners }: { data: any[]; middleBanners: any[] }) => {
  const [cursor, setCursor] = useState(0);
  const bannerGroup = useMemo(() => {
    if (!!middleBanners) return chunk(middleBanners, 2);
  }, [middleBanners]);
  return (
    <div className="w-full px-3  md:px-3 lg:px-4 2xl:px-[10%] ">
      <HomePropertiesSsrPart middleBanners={bannerGroup} data={data} />
      {cursor == 0 && !isEmpty(data) && data?.length % 24 == 0 ? (
        <Button
          onClick={() => {
            setCursor(last(data)?.id || 0);
          }}
          title={_STRINGS.SHOW_MORE}
          containerClass="w-full flex items-center justify-center"
        />
      ) : (
        <></>
      )}
      {cursor == 0 ? <></> : <HomePropertiesClientPart cursor={cursor} setCursor={setCursor} />}
    </div>
  );
};

export default HomePropertiesList;
