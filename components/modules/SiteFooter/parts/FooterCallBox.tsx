import type { FooterCallBoxProps } from "@/types/components/modules/site-footer";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { ImageFallback } from "@elements/Image";

import FooterHostCta from "./FooterHostCta.client";
import CmsText from "@/components/shared/CmsText";
import Editable from "@/components/Editable";
import _STRINGS from "@/utils/LocalStrings";

const FooterCallBox = ({ content }: FooterCallBoxProps) => (
  <div className="w-full p-4 md:px-[10%] -top-24 absolute">
    <div className="w-full min-h-[10rem] md:w-full px-6 py-6 md:py-0 gap-6 mx-auto bg-brand-600 rounded-20 relative flex flex-col md:flex-row items-center justify-between">
      <ImageFallback
        width={512}
        height={384}
        sizes="224px"
        alt="footer_image"
        fallbackSrc="/assets/images/home/footer_car.png"
        className="md:absolute bottom-0 lg:flex !max-w-[14rem] h-auto"
        src={
          getHomeImageUrl(content?.feature_image) ||
          "/assets/images/footer/footer_place_holder_image.png"
        }
      />

      <Editable
        contentId={content?.id}
        className="flex flex-col md:flex-row justify-between items-center gap-3 py-4 md:pr-[15rem]"
      >
        <div className="flex flex-col gap-4">
          <p className="font-bold text-white text-base md:text-xl">
            {content?.title}
          </p>
          <CmsText whitespace="normal" className="text-sm text-white">
            {content?.small_text}
          </CmsText>
        </div>

        <FooterHostCta
          title={_STRINGS.BECOME_HOST}
          link={content?.link || ""}
        />
      </Editable>
    </div>
  </div>
);

export default FooterCallBox;
