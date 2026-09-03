import type { THomeProper } from "@/types/components/modules/property-discovery";

import HomePropertiesGrid from "./parts/HomePropertiesGrid";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

const HomePropertiesList = ({ data, devices, middleBanner }: THomeProper) => {
  return (
    <div className="w-full  padding-x ">
      <HomePropertiesGrid
        data={data}
        devices={devices}
        middleBanner={middleBanner}
      />
      {!isEmpty(data) && data?.length % 12 === 0 && (
        <Link
          href="/rooms"
          className="w-full"
          title={_STRINGS.SHOW_MORE}
        >
          <Button
            title={_STRINGS.SHOW_MORE}
            containerClass="w-full flex items-center justify-center"
          />
        </Link>
      )}
    </div>
  );
};

export default HomePropertiesList;
