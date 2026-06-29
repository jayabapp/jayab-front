import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";

export async function GET(request: Request) {
  const { data } = await serverCall(baseUrl + apiRoutes.SETTING_LLMS);
  return new Response(data, { status: 200 });
}
