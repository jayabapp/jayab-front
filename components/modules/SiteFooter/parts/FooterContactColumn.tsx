import { useTranslations } from "next-intl";
import { ContactItem } from "@modules/ContactInfo";

import type { FooterContactColumnProps } from "@/types/components/modules/site-footer";

const ENAMAD_ID = process.env.NEXT_PUBLIC_ENAMAD_ID || "8014138";
const ENAMAD_CODE =
  process.env.NEXT_PUBLIC_ENAMAD_CODE || "O7ale9REZhTEPeCX04KWuR2IaPObkxLB";

const FooterContactColumn = ({ contacts }: FooterContactColumnProps) => {
  const t = useTranslations("footer");

  return (
    <div className="col-span-4 lg:col-span-2 flex w-full flex-col justify-between h-fit order-2 lg:order-1">
      <div className="flex justify-center flex-col gap-4 mt-3 mb-4">
        <p className="text-base md:text-lg font-bold pb-0 lg:pb-4">
          {t("contactWays")}
        </p>

        {contacts?.map((contact) => (
          <ContactItem
            e={contact}
            textClass=" !font-normal "
            key={`footer-contact-${contact?.id}`}
          />
        ))}
      </div>

      {ENAMAD_ID && ENAMAD_CODE ? (
        <a
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 w-fit items-center text-sm underline underline-offset-4 hover:text-link"
          referrerPolicy="origin"
          href={`https://trustseal.enamad.ir/?id=${encodeURIComponent(ENAMAD_ID)}&code=${encodeURIComponent(ENAMAD_CODE)}`}
        >
          {t("enamadLink")}
        </a>
      ) : null}
    </div>
  );
};

export default FooterContactColumn;
