import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/globals.css";
import { Iransans_font } from "./fonts/Iransans_font";
import LayoutProvider from "./layout-provider";

export const metadata: Metadata = {
  title: "جایاب",
  description: "جایاب",
};

export default function RootLayout({
  children,
  params,
  modal,
}: Readonly<{
  children: React.ReactNode;
  params: { [key: string]: string };
  modal: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir={"rtl"}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>{"جایاب"}</title>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta> */}
        {/* <title>{process.env.NEXT_PUBLIC_NAME}</title> */}
        <meta name="keywords" content="جایاب" />
        {/* <title>تــک رخ</title> */}
        <meta name="description" content="جایاب" />
        {/* <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" /> */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="شهر دپو" />
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/app/apple-touch-icon.png" /> */}
      </head>
      <body className={`${Iransans_font.className} `}>
        <LayoutProvider modal={modal} params={params}>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
