"use client";

import { usePathname } from "next/navigation";

const HIDE_AURORA_MATCH = /\/owner\/properties\/[^/]+\/edit(\/|$)/;

const AuroraBackdrop = () => {
  const pathname = usePathname();
  if (pathname && HIDE_AURORA_MATCH.test(pathname)) return null;

  return <div aria-hidden className="aurora-layer" />;
};

export default AuroraBackdrop;
