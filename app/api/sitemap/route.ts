import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";

export async function GET(request: Request) {
  const { data } = await serverCall(baseUrl + apiRoutes.SETTING_SITEMAP);
  return new Response(data, { status: 200, headers: { "Content-Type": `text/xml` } });
}
