import { getServerLandingOr404 } from "@features/home/server/home.server";

import type { ReactNode } from "react";

type LandingLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

const LandingLayout = async ({ children, params }: LandingLayoutProps) => {
  await getServerLandingOr404((await params).slug);
  return children;
};

export default LandingLayout;
