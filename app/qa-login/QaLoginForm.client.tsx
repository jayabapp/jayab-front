"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const INPUT_CLASS =
  "h-11 rounded-10 border border-neutral-200 px-3 text-sm text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

const QaLoginForm = ({ next }: { next?: string }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/qa-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError(
          response.status === 429
            ? "تعداد تلاش‌ها بیش از حد مجاز است؛ کمی بعد دوباره تلاش کنید."
            : "نام کاربری یا رمز عبور اشتباه است.",
        );
        return;
      }
      const destination = next && next.startsWith("/") ? next : "/";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("خطایی رخ داد. دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="qa-username" className="text-sm font-medium text-neutral-800">
          نام کاربری
        </label>
        <input
          id="qa-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="qa-password" className="text-sm font-medium text-neutral-800">
          رمز عبور
        </label>
        <input
          id="qa-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className={INPUT_CLASS}
        />
      </div>

      {error ? <p className="text-sm text-danger-500">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 cursor-pointer rounded-10 bg-brand-600 text-base font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
};

export default QaLoginForm;
