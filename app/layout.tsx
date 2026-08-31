import { mobileFooterBlackList } from "@/utils/constantss";
import { footerHiddenBlackList } from "@/utils/constantss";
import { AppOverlays, AppShell } from "@modules/AppShell";
import { isNoIndexDeployment } from "@/helpers/indexingPolicy";
import { Metadata, Viewport } from "next";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { InnitSettingsDto } from "@/api_services/home/home.interface";
import { headerBlackList } from "@/utils/constantss";
import { x_Iransans } from "./fonts/x_iran/x_Iransans";
import { MainLayout } from "@layouts/MainLayout";
import { SiteFooter } from "@modules/SiteFooter";
import { SiteHeader } from "@modules/SiteHeader";
import { REVALIDATE } from "@/helpers/revalidate";
import { MobileNav } from "@modules/MobileNav";
import { ReactNode } from "react";

import LayoutProvider from "./layout-provider.client";
import SplashScreen from "@/components/SplashScreen";
import serverCall from "@/helpers/serverCall";
import Script from "next/script";

import "../styles/globals.css";

const CHROME_HIDDEN_ROUTES = [
  ...mobileFooterBlackList,
  ...footerHiddenBlackList,
];

const indexingDisabled = isNoIndexDeployment();

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://jayaab.com",
  ),
  title: {
    default: "جایاب",
    template: "%s | جایاب",
  },
  description: "جایاب",
  keywords: ["جایاب"],
  applicationName: "جایاب",
  robots: indexingDisabled
    ? {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      }
    : undefined,
  openGraph: {
    title: "جایاب",
    description: "جایاب",
    type: "website",
    locale: "fa_IR",
  },

  icons: {
    icon: [
      {
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "جایاب",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = async ({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) => {
  const { data: appSetting }: { data: InnitSettingsDto } = await serverCall(
    baseUrl + apiRoutes.APP_SETTINGS,
    undefined,
    { revalidate: REVALIDATE.APP_SETTINGS },
  );

  const gtmId = appSetting?.googleTagManagerId?.toString() || "";

  return (
    <html lang="fa" dir="rtl">
      <body className={x_Iransans.className} suppressHydrationWarning>
        <SplashScreen />
        <LayoutProvider>
          <AppShell>
            <MainLayout
              header={<SiteHeader />}
              footer={<SiteFooter />}
              overlays={<AppOverlays />}
              mobileFooter={<MobileNav />}
              headerHiddenOn={headerBlackList}
              footerHiddenOn={CHROME_HIDDEN_ROUTES}
              mobileFooterHiddenOn={CHROME_HIDDEN_ROUTES}
            >
              {children}
              {modal}
            </MainLayout>
          </AppShell>
        </LayoutProvider>
        <footer>
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />

          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>

          <Script
            id="yekta"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `!function (t, e, n) {
t.yektanetAnalyticsObject = n, t[n] = t[n] || function () {
t[n].q.push(arguments)
}, t[n].q = t[n].q || [];
var a = new Date, r = a.getFullYear().toString() + "0" + a.getMonth() + "0" + a.getDate() + "0" + a.getHours(),
c = e.getElementsByTagName("script")[0], s = e.createElement("script");
s.id = "ua-script-Sfsc56h6"; s.dataset.analyticsobject = n;
s.async = 1; s.type = "text/javascript";
s.src = "https://cdn.yektanet.com/rg_woebegone/scripts_v3/Sfsc56h6/rg.complete.js?v=" + r, c.parentNode.insertBefore(s, c)
}(window, document, "yektanet");`,
            }}
          />
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
