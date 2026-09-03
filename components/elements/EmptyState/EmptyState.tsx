"use client";

import type { EmptyStateProps } from "@/types/components/elements/empty-state";

import LottieAnimationDark from "@/public/assets/lotties/emptyDark.json";
import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";
import Link from "next/link";

const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
  loading: () => <div className="w-1/2 aspect-square" />,
});

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionRoute,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex w-full justify-center py-6">
      <div className="flex max-w-sm scale-90 flex-col items-center">
        <Lottie
          options={{
            animationData: LottieAnimationDark,
            loop: false,
          }}
          width={"50%"}
        />

        <p className="-mt-2 text-center font-medium text-neutral-600">
          {title || _STRINGS?.EMPTY_LIST}
        </p>

        {description ? (
          <p className="mt-2 text-center text-sm font-light leading-6 text-neutral-500">
            {description}
          </p>
        ) : (
          <></>
        )}

        {actionLabel && actionRoute ? (
          <Link
            href={actionRoute}
            className="btn-glass-primary mt-5 rounded-2xl px-6 py-2.5 text-sm font-medium"
          >
            {actionLabel}
          </Link>
        ) : actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="btn-glass-primary mt-5 rounded-2xl px-6 py-2.5 text-sm font-medium"
          >
            {actionLabel}
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
