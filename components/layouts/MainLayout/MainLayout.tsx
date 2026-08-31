import type { MainLayoutProps } from "@/types/components/layouts/main-layout";
import { Suspense } from "react";

import ChromeSlot from "./parts/ChromeSlot.client";

const MainLayout = ({
  header,
  footer,
  children,
  overlays,
  mobileFooter,
  headerHiddenOn,
  footerHiddenOn,
  mobileFooterHiddenOn,
}: MainLayoutProps) => (
  <div className="app-background app-text transition-opacity">
    <ChromeSlot match="exact" hiddenOn={headerHiddenOn}>
      {header}
    </ChromeSlot>

    <div className="app-size relative">
      <div style={{ minHeight: "100dvh" }} className="mx-auto h-full w-full">
        {children}
      </div>

      <Suspense>
        <ChromeSlot hiddenOn={footerHiddenOn}>{footer}</ChromeSlot>
        <ChromeSlot hiddenOn={mobileFooterHiddenOn}>{mobileFooter}</ChromeSlot>
      </Suspense>
    </div>

    {overlays}
  </div>
);

export default MainLayout;
