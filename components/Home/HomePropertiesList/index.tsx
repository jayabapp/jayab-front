"use client";

import { DeviceInfo } from "@/helpers/device.detector";
import { useState } from "react";
import { isEmpty } from "lodash";

import HomePropertiesClientPart from "./HomePropertiesClientPart";
import HomePropertiesSsrPart from "./HomePropertiesSsrPart";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";
import Link from "next/link";

const HomePropertiesList = ({
  data,
  devices,
  middleBanner,
}: {
  data: any[];
  middleBanner?: any;
  devices?: DeviceInfo;
}) => {
  const [page, setPage] = useState(1);

  return (
    <div className="w-full  padding-x ">
      <HomePropertiesSsrPart
        data={data}
        devices={devices}
        middleBanner={middleBanner}
      />
      {page === 1 && !isEmpty(data) && data?.length % 12 === 0 && (
        <Link
          href="/rooms"
          prefetch={false}
          className="w-full"
          title={_STRINGS.SHOW_MORE}
        >
          <Button
            title={_STRINGS.SHOW_MORE}
            containerClass="w-full flex items-center justify-center"
          />
        </Link>
      )}
      {page !== 1 && <HomePropertiesClientPart page={page} setPage={setPage} />}
    </div>
  );
};

export default HomePropertiesList;
