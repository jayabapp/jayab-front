import { ContentImage } from "@elements/Image";

import type { Metadata } from "next";

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
        <ContentImage
          alt=""
          width={40}
          height={40}
          className="mb-6 size-10"
          src="/assets/icons/logo/mark.svg"
        />
        <QaLoginForm next={next} />
      </div>
    </div>
  );
};

export default QaLoginPage;
