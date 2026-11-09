import { getServerContentList } from "@features/home/server/home.server";
import { resolveLocale } from "@/i18n/config";
import { FaqSchema } from "@features/seo/components/Schemas";
import { getLocale } from "next-intl/server";

import type { ContentDto } from "@/api_services/home/home.interface";

import FaqContent from "@modules/FaqContent";
import FaqTemplate from "@templates/Faq";

const FaqPage = async () => {
  const locale = resolveLocale(await getLocale());
  const { data }: { data: { data: ContentDto[] } } = await getServerContentList(
    "faq",
    1,
    20,
    false,
    locale,
  );
  return (
    <FaqTemplate schema={<FaqSchema items={data?.data} />}>
      <FaqContent items={data?.data} />
    </FaqTemplate>
  );
};

export default FaqPage;
