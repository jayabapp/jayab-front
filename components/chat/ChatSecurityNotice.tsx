const ChatSecurityNotice = () => (
  <aside
    aria-label="هشدار امنیتی"
    className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-right text-xs leading-5 text-amber-950 md:px-5"
  >
    <p>
      <strong>هشدار امنیتی:</strong> جایاب هرگز{" "}
      <strong>رمز عبور یا کد تأیید پیامکی</strong> شما را درخواست نمی‌کند. در
      صورت مشاهده پیام مشکوک یا فردی که خود را پشتیبانی جایاب معرفی می‌کند، از
      ارسال کد و اطلاعات حساس خودداری کرده و موضوع را گزارش کنید.
    </p>
    <p className="mt-1">
      مکالمات در جایاب ثبت و قابل بررسی است و در صورت تخلف، مطابق ضوابط قانونی
      و درخواست مراجع ذی‌صلاح پیگیری خواهد شد.
    </p>
  </aside>
);

export default ChatSecurityNotice;
