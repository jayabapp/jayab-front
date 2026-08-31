import type { FooterContactColumnProps } from "@/types/components/modules/site-footer";
import { ContentImage } from "@elements/Image";

import ContactuUItem from "@/components/contactus/ContactuUItem";
import _STRINGS from "@/utils/LocalStrings";

const ENAMAD_ID = process.env.NEXT_PUBLIC_ENAMAD_ID;
const ENAMAD_CODE = process.env.NEXT_PUBLIC_ENAMAD_CODE;

const FooterContactColumn = ({ contacts }: FooterContactColumnProps) => (
  <div className="col-span-4 lg:col-span-2 flex w-full flex-col justify-between h-fit order-2 lg:order-1">
    <div className="flex justify-center flex-col gap-4 mt-3 mb-4">
      <p className="text-base md:text-lg font-bold pb-0 lg:pb-4">
        {_STRINGS.COMUNICATION_WAYS}
      </p>

      {contacts?.map((contact) => (
        <ContactuUItem
          e={contact}
          textClass=" !font-normal "
          key={`footer-contact-${contact?.id}`}
        />
      ))}
    </div>

    {ENAMAD_ID && ENAMAD_CODE ? (
      <div className="flex flex-row w-fit items-center justify-center gap-5">
        <a
          target="_blank"
          className="w-16 h-16"
          referrerPolicy="origin"
          href={`https://trustseal.enamad.ir/?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
        >
          <ContentImage
            alt=""
            unoptimized
            width={64}
            height={64}
            loading="lazy"
            id={ENAMAD_CODE}
            className="w-16 h-16"
            referrerPolicy="origin"
            src={`https://trustseal.enamad.ir/logo.aspx?id=${ENAMAD_ID}&Code=${ENAMAD_CODE}`}
          />
        </a>
      </div>
    ) : null}
  </div>
);

export default FooterContactColumn;
