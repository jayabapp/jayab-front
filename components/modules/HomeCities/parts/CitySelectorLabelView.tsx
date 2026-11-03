import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

const CitySelectorLabelView = ({ title }: { title?: string }) => {
  const t = useTranslations("header");

  return (
    <>
      <p
        title={title || undefined}
        className={`max-w-40 shrink-0 truncate text-sm font-normal md:font-bold ${title ? "text-ink opacity-70" : "text-ink opacity-40"}`}
      >
        {title || t("chooseCity")}
      </p>
      <ContentImage
        alt=""
        width={20}
        height={20}
        src="/assets/icons/home/home_location.svg"
        className={`aspect-auto h-5 ${title ? "text-ink opacity-70" : "opacity-40"}`}
      />
    </>
  );
};

export default CitySelectorLabelView;
