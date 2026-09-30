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
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-20 border border-neutral-200 bg-white p-6 shadow-glass-sm">
        <h1 className="mb-1 text-lg font-bold text-neutral-900">
          ورود به محیط تست جایاب
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          این نسخه فقط برای تیم داخلی است. نام کاربری و رمز عبوری که از تیم
          دریافت کرده‌اید را وارد کنید.
        </p>
        <QaLoginForm next={next} />
      </div>
    </div>
  );
};

export default QaLoginPage;
