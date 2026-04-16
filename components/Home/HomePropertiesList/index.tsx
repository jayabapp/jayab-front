"use client";

import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { chunk, isEmpty } from "lodash";
import Link from "next/link";
import { useMemo, useState } from "react";
import HomePropertiesClientPart from "./HomePropertiesClientPart";
import HomePropertiesSsrPart from "./HomePropertiesSsrPart";

const HomePropertiesList = ({ data, middleBanners }: { data: any[]; middleBanners: any[] }) => {
  const [page, setPage] = useState(1);
  const bannerGroup = useMemo(() => {
    if (!!middleBanners) return chunk(middleBanners, 2);
  }, [middleBanners]);
  return (
    <div className="w-full  padding-x ">
      <HomePropertiesSsrPart middleBanners={bannerGroup || []} data={data} />
      {page == 1 && !isEmpty(data) && data?.length % 24 == 0 ? (
        <Link className="w-full " href={"/rooms"} prefetch={false}>
          <Button
            // onClick={() => {
            //   setPage(2);
            // }}
            title={_STRINGS.SHOW_MORE}
            containerClass="w-full flex items-center justify-center"
          />
        </Link>
      ) : (
        <></>
      )}
      {page == 1 ? <></> : <HomePropertiesClientPart page={page} setPage={setPage} />}
    </div>
  );
};

export default HomePropertiesList;
