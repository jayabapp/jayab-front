import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

const CitySelectorLabelView = ({ title }: { title?: string }) => (
  <>
    <p
      title={title || undefined}
      className={`max-w-40 shrink-0 truncate text-sm font-normal md:font-bold ${title ? "text-black opacity-70" : "text-black opacity-40"}`}
    >
      {title || _STRINGS.SELECT_CITY}
    </p>
    <ContentImage
      alt=""
      width={20}
      height={20}
      src="/assets/icons/home/home_location.svg"
      className={`aspect-auto h-5 ${title ? "text-black opacity-70" : "opacity-40"}`}
    />
  </>
);

export default CitySelectorLabelView;
