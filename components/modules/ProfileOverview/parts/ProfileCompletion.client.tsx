"use client";

import { useTranslations } from "next-intl";

import type { ProfileCompletionProps } from "@/types/components/modules/profile";

import Link from "next/link";

const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  const t = useTranslations("profile");

  const steps = [
    { id: "mobile", done: !!profile?.mobile_number, title: t("profileCompletionMobile") },
    { id: "name", done: !!profile?.full_name?.trim(), title: t("profileCompletionName") },
    { id: "image", done: !!profile?.profile_image, title: t("profileCompletionImage") },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  if (percent === 100) return <></>;

  return (
    <div className="glass-surface flex flex-col gap-4 rounded-28 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-neutral-900">
            {t("profileCompletionTitle")}
          </p>
          <p className="text-xs text-neutral-600">
            {t("profileCompletionHint")}
          </p>
        </div>
        <p className="shrink-0 text-2xl font-bold text-brand-600">{percent}%</p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={t("profileCompletionTitle")}
        className="h-2 w-full overflow-hidden rounded-full bg-white/70"
      >
        <div
          style={{ width: `${percent}%` }}
          className="h-full rounded-full bg-gradient-to-l from-brand-700 to-brand-400 transition-all duration-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step) => (
          <span
            key={`completion${step.id}`}
            className={`rounded-full border px-3 py-1 text-xs ${
              step.done
                ? "border-success-500/30 bg-success-50 text-success-600"
                : "border-white/70 bg-white/60 text-neutral-600"
            }`}
          >
            {step.done ? "✓ " : ""}
            {step.title}
          </span>
        ))}
      </div>

      <Link
        prefetch
        href="/profile/edit"
        className="btn-glass-primary w-fit rounded-2xl px-6 py-2.5 text-sm font-medium"
      >
        {t("profileCompletionCta")}
      </Link>
    </div>
  );
};

export default ProfileCompletion;
