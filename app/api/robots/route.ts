import { apiRoutes, baseUrl } from "@/utils/urls";
import { isNoIndexRequest } from "@/helpers/indexingPolicy";
import { REVALIDATE } from "@/helpers/revalidate";

import serverCall from "@/helpers/serverCall";

export async function GET(request: Request) {
  if (isNoIndexRequest(request)) {
    return new Response("User-agent: *\nAllow: /\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  const { data } = await serverCall(
    baseUrl + apiRoutes.SETTING_ROBOTS,
    undefined,
    {
      revalidate: REVALIDATE.SEO_FILE,
    },
  );
  return new Response(data, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
