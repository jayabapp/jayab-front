import { useTranslations } from "next-intl";

import type { THomeProper } from "@/types/components/modules/property-discovery";

import HomePropertiesGrid from "./parts/HomePropertiesGrid";
import isEmpty from "lodash/isEmpty";
import Button from "@elements/Button";
import Link from "next/link";

const HomePropertiesList = ({ data, devices, middleBanner }: THomeProper) => {
  const t = useTranslations("listing");

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
          title={t("showMore")}
        >
          <Button
            title={t("showMore")}
            containerClass="w-full flex items-center justify-center"
          />
        </Link>
      )}
    </div>
  );
};

export default HomePropertiesList;
