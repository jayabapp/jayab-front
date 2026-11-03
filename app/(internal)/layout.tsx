import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

const InternalLayout = ({ children }: { children: ReactNode }) => children;

export default InternalLayout;
