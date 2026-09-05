"use client";

import type { ProfileCompletionProps } from "@/types/components/modules/profile";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const ProfileCompletion = ({ profile }: ProfileCompletionProps) => {
  // Only the fields the user can actually act on from their account page count
  // here; owner verification lives in its own flow and would leave every guest
  // permanently "incomplete".
  const steps = [
    { id: "mobile", done: !!profile?.mobile_number, title: _STRINGS.PROFILE_COMPLETION_MOBILE },
    { id: "name", done: !!profile?.full_name?.trim(), title: _STRINGS.PROFILE_COMPLETION_NAME },
    { id: "image", done: !!profile?.profile_image, title: _STRINGS.PROFILE_COMPLETION_IMAGE },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const percent = Math.round((doneCount / steps.length) * 100);

  // A finished profile has nothing to nag about.
  if (percent === 100) return <></>;

  return (
    <div className="glass-surface flex flex-col gap-4 rounded-28 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-neutral-900">
            {_STRINGS.PROFILE_COMPLETION_TITLE}
          </p>
          <p className="text-xs text-neutral-600">
            {_STRINGS.PROFILE_COMPLETION_HINT}
          </p>
        </div>
        <p className="shrink-0 text-2xl font-bold text-brand-600">{percent}%</p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label={_STRINGS.PROFILE_COMPLETION_TITLE}
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
        {_STRINGS.PROFILE_COMPLETION_CTA}
      </Link>
    </div>
  );
};

export default ProfileCompletion;
