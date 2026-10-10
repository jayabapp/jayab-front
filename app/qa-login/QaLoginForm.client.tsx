"use client";

import { useState, type FormEvent } from "react";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useRouter } from "next/navigation";
import { Icon } from "@elements/Icon";

const INPUT_CLASS =
  "h-11 w-full rounded-10 border border-line px-3 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-focus";

const QaLoginForm = ({ next }: { next?: string }) => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const destination = safeInternalPath(next) || "/";
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
        <label htmlFor="qa-username" className="text-sm font-medium text-ink">
          نام کاربری
        </label>
        <input
          required
          type="text"
          id="qa-username"
          value={username}
          autoComplete="username"
          className={INPUT_CLASS}
          onChange={(event) => setUsername(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="qa-password" className="text-sm font-medium text-ink">
          رمز عبور
        </label>
        <div className="relative">
          <input
            required
            id="qa-password"
            value={password}
            autoComplete="current-password"
            className={`${INPUT_CLASS} pl-10`}
            type={showPassword ? "text" : "password"}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute inset-y-0 left-0 flex w-10 cursor-pointer items-center justify-center text-ink-subtle hover:text-ink"
          >
            <Icon name={showPassword ? "eye-off" : "eye"} size={20} />
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-status-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 cursor-pointer rounded-10 bg-action text-base font-medium text-on-action transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
};

export default QaLoginForm;
