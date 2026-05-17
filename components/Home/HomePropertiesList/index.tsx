"use client";

import Button from "@/components/shared/Button/Button";
import { DeviceInfo } from "@/helpers/device.detector";
import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import Link from "next/link";
import { useState } from "react";
import HomePropertiesClientPart from "./HomePropertiesClientPart";
import HomePropertiesSsrPart from "./HomePropertiesSsrPart";

const HomePropertiesList = ({
  data,
  middleBanners,
  devices,
}: {
  data: any[];
  middleBanners: any[];
  devices?: DeviceInfo;
}) => {
  const [page, setPage] = useState(1);

  return (
    <div className="w-full  padding-x ">
      <HomePropertiesSsrPart middleBanners={middleBanners || []} data={data} devices={devices} />
      {page == 1 && !isEmpty(data) && data?.length % 12 == 0 ? (
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
