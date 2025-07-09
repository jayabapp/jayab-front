import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/globals.css";

import LayoutProvider from "./layout-provider";
import { x_Iransans } from "./fonts/x_iran/x_Iransans";
import { InnitSettingsDto } from "@/api_services/home/home.interface";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";

import * as Sentry from "@sentry/nextjs";
export function generateMetadata(): Metadata {
  return {
    title: {
      template: "%s | جایاب",
      default: "جایاب",
    },
    description: "جایاب",
    other: {
      ...Sentry.getTraceData(),
    },
  };
}
// export const metadata: Metadata = {
//   title: {
//     template: "%s | جایاب",
//     default: "جایاب",
//   },
//   description: "جایاب",
// };

const RootLayout = async ({
  children,
  params,
  modal,
}: Readonly<{
  children: React.ReactNode;
  params: { [key: string]: string };
  modal: React.ReactNode;
}>) => {
  const { data: appSetting }: { data: InnitSettingsDto } = await serverCall(baseUrl + apiRoutes.APP_SETTINGS);

  return (
    <html lang="fa" dir={"rtl"}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        {/* <title>{"جایاب"}</title> */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta> */}
        {/* <title>{process.env.NEXT_PUBLIC_NAME}</title> */}
        {/* {appSetting?.activeGoogleIndex === "0" && <meta name="googlebot" content="noindex,nofollow" />} */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${appSetting?.googleTagManagerId?.toString()}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        ></noscript>
        <meta name="keywords" content="جایاب" />
        <meta property="og:title" content="جایاب" />
        {/* <title>تــک رخ</title> */}
        <meta property="og:description" content="جایاب" />
        {/* <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" /> */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="جایاب" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/app/apple-touch-icon.png" /> */}
      </head>
      <body className={`${x_Iransans.className} `}>
        <LayoutProvider modal={modal} params={params}>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;
