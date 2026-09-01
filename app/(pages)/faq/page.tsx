import { getServerContentList } from "@features/home/server/home.server";
import { FaqSchema } from "@features/seo/components/Schemas";

import type { ContentDto } from "@/api_services/home/home.interface";

import FaqContent from "@modules/FaqContent";
import FaqTemplate from "@templates/Faq";

const FaqPage = async () => {
  const { data }: { data: { data: ContentDto[] } } = await getServerContentList("faq", 1, 20);
  return <FaqTemplate schema={<FaqSchema />}><FaqContent items={data?.data} /></FaqTemplate>;
};

export default FaqPage;
