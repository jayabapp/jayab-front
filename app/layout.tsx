// app/layout.tsx
import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/globals.css";

import { InnitSettingsDto } from "@/api_services/home/home.interface";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { x_Iransans } from "./fonts/x_iran/x_Iransans";
import LayoutProvider from "./layout-provider";

import * as Sentry from "@sentry/nextjs";
import type { ReactNode } from "react";

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

const RootLayout = async ({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) => {
  // server-side fetch
  const { data: appSetting }: { data: InnitSettingsDto } = await serverCall(baseUrl + apiRoutes.APP_SETTINGS);

  // safe defaults for LayoutProvider (root layout doesn't receive params/modal)
  const params: Record<string, string> = {};
  // const modal: ReactNode = null;

  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${appSetting?.googleTagManagerId?.toString()}"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        <meta name="keywords" content="جایاب" />
        <meta property="og:title" content="جایاب" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="جایاب" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${x_Iransans.className}`}>
        <LayoutProvider modal={modal} params={params}>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;
