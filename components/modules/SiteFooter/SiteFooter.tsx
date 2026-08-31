import type { FooterContentEntry } from "@/types/components/modules/site-footer";
import { getServerContentList } from "@features/home/server/home.server";
import { getServerCmsContent } from "@features/home/server/home.server";

import FooterContactColumn from "./parts/FooterContactColumn";
import FooterAboutColumn from "./parts/FooterAboutColumn";
import FooterLinksColumn from "./parts/FooterLinksColumn";
import FooterQuickSearch from "./parts/FooterQuickSearch";
import FooterBottomBar from "./parts/FooterBottomBar";
import FooterSocialRow from "./parts/FooterSocialRow";
import FooterCallBox from "./parts/FooterCallBox";
import FooterCallFab from "./parts/FooterCallFab";

const CONTACT_PER_PAGE = 100;
const DOWNLOAD_PER_PAGE = 20;
const QUICK_LINK_PER_PAGE = 100;

const SiteFooter = async () => {
  const [about, callUs, contactsResponse, downloadsResponse, quickResponse] =
    await Promise.all([
      getServerCmsContent("aboutUs"),
      getServerCmsContent("footerCallUs"),
      getServerContentList("contactUs", 1, CONTACT_PER_PAGE),
      getServerContentList("downloadLinks", 1, DOWNLOAD_PER_PAGE),
      getServerContentList("footer-quick-search-links", 1, QUICK_LINK_PER_PAGE),
    ]);

  const contacts: FooterContentEntry[] = contactsResponse?.data?.data ?? [];
  const socials = contacts.filter((entry) => entry?.fields?.key === "social");
  const others = contacts.filter((entry) => entry?.fields?.key !== "social");
  const phone = others.find(
    (entry) => entry?.fields?.key === "tel" || entry?.key === "tel",
  );

  return (
    <footer className="w-full z-2 bg-neutral-400/40 flex flex-col items-center justify-center bg-dark-500 bg-no-repeat bg-cover relative pt-[28rem] md:pt-[16rem] lg:pt-[6rem]">
      <FooterCallBox content={callUs} />
      <FooterQuickSearch links={quickResponse?.data?.data ?? []} />
      <FooterCallFab phone={phone} />

      <div className="w-full padding-x lg:w-full mx-auto py-4 grid grid-cols-4 lg:grid-cols-7 gap-5">
        <FooterAboutColumn about={about} socials={socials} />
        <div className="hidden md:flex col-span-1 order-2 lg:order-1" />
        <FooterLinksColumn />
        <div className="hidden md:flex col-span-1 order-2 lg:order-1" />
        <FooterContactColumn contacts={others} />
      </div>

      <div className="md:hidden flex flex-col gap-2 items-center justify-center">
        <FooterSocialRow
          socials={socials}
          className="flex justify-center mt-3 mb-4 gap-2"
        />
      </div>

      <FooterBottomBar downloadLinks={downloadsResponse?.data?.data ?? []} />
    </footer>
  );
};

export default SiteFooter;
