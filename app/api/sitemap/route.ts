import serverCall from "@/helpers/serverCall";
import { REVALIDATE } from "@/helpers/revalidate";
import { apiRoutes, baseUrl } from "@/utils/urls";

export async function GET(request: Request) {
  const { data } = await serverCall(baseUrl + apiRoutes.SETTING_SITEMAP, undefined, {
    revalidate: REVALIDATE.SEO_FILE,
  });
  return new Response(data, { status: 200, headers: { "Content-Type": `text/xml` } });
}
