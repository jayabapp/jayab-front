import { md5 } from "js-md5";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import serverCall from "./helpers/serverCall";
import { guardedDirectories } from "./utils/constantss";
import { apiRoutes, baseUrl } from "./utils/urls";
export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const PATH_NAME = request.nextUrl.pathname;
  const queryParams = request.nextUrl.searchParams;
  const queriesArray = Array.from(queryParams?.entries());
  const cookiesState = await cookies();
  const isLogin = cookiesState.get("isLogin")?.value;

  /* -------------------------------------------------------------------------- */
  /*                       REDIRECT GUARDED ROUTES TO AUTH                      */
  /* -------------------------------------------------------------------------- */

  if (!isLogin && !!guardedDirectories?.find((e) => PATH_NAME.includes(e))) {
    const response = NextResponse.redirect(new URL(`/auth?redirect_url=${PATH_NAME}`, request.url), 307);
    return response;
  }

  ////////////////////////////////

  const HREF = `${process.env.NEXT_PUBLIC_WEB_SITE}${PATH_NAME}${
    queriesArray?.length > 0
      ? "?" +
        queriesArray
          ?.map((e) => `${e[0]}=${encodeURI(e[1])}`)
          .join("&")
          .toString()
      : ""
  }`;
  headers.set("x-pathname", HREF);
  headers.set("x-canonical", `${process.env.NEXT_PUBLIC_WEB_SITE}${PATH_NAME}`);

  if (
    !headers.get("referer")?.includes("localhost") &&
    !headers.get("referer")?.includes(`${process.env.NEXT_PUBLIC_WEB_SITE}`)
  ) {
    if (PATH_NAME != "/") {
      const HASHED = md5(decodeURI(HREF));

      const { data } = await serverCall(baseUrl + apiRoutes.REDIRECT_CHECK(HASHED) + `?href=${HREF}`);
      if (!!data) {
        const response = NextResponse.redirect(new URL(data?.destination, request.url), data?.permanent ? 308 : 307);

        response.headers.set("x-canonical", encodeURI(data?.destination));
        return response;
      }
    }
    // headers.set("is-refresh", "1");
  } else {
    // headers.set("is-refresh", "0");
  }

  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|static|_next/image|assets/|favicon.ico|sitemap.xml|robots.txt|.well-known|sw.js|workbox*).*)",
  ],
};
