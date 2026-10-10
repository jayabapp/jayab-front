import type { Metadata } from "next";
import SplashLogo from "@/components/layouts/SplashScreen/SplashLogo";
import QaLoginForm from "./QaLoginForm.client";

export const metadata: Metadata = {
  title: "ورود به محیط تست",
  robots: { index: false, follow: false },
};

const QaLoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) => {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-20 border border-line bg-surface p-6 shadow-glass-sm">
        <SplashLogo className="mb-6 h-10 w-10 text-link" />
        <QaLoginForm next={next} />
      </div>
    </div>
  );
};

export default QaLoginPage;
