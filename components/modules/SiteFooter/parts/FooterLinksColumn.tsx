import { footerLinks } from "@/utils/constantss";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const FooterLinksColumn = () => (
  <div className="col-span-4 lg:col-span-1 gap-2 flex w-full flex-col justify-between h-fit order-2 lg:order-1">
    <p className="text-base md:text-lg font-bold pb-4">
      {_STRINGS.FAST_ACCESS}
    </p>

    <div className="lg:grid-cols-1 grid grid-cols-2 gap-2 grid-rows-2 lg:grid-rows-none">
      {footerLinks?.map((entry) => (
        <Link
          prefetch={false}
          title={entry?.title}
          href={entry.route || "#"}
          key={`footer-link-${entry.id}`}
          style={{ textDecoration: "none" }}
          className="flex items-center gap-2 mb-2"
        >
          <p className="text-sm cursor-pointer opacity-100 hover:text-brand-600">
            {entry?.title}
          </p>
        </Link>
      ))}
    </div>
  </div>
);

export default FooterLinksColumn;
