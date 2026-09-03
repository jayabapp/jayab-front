"use client";

import type { AuthHeaderProps } from "@/types/components/layouts/main-layout";
import { useRouter } from "next/navigation";
import { colors } from "@/theme/colors";

const AuthHeader = ({ title, backRoute, disableBack, onBack }: AuthHeaderProps) => {
  const router = useRouter();

  return (
    <div className="glass-header fixed left-0 top-0 z-10 flex h-16 w-full items-center justify-between px-5 py-4 transition-all">
      {disableBack ? (
        <p className="opacity-0 w-6" />
      ) : (
        <svg
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 18 24"
          className="mt-0.5 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            if (onBack) return onBack();
            return backRoute ? router.push(backRoute) : router.back();
          }}
        >
          <path
            d="M16 11.939C16 12.3208 15.854 12.6465 15.5508 12.9385L6.79102 21.5073C6.55518 21.7544 6.24072 21.8779 5.88135 21.8779C5.15137 21.8779 4.57861 21.3164 4.57861 20.5752C4.57861 20.2158 4.72461 19.8901 4.97168 19.6431L12.8667 11.939L4.97168 4.23486C4.72461 3.97656 4.57861 3.65088 4.57861 3.2915C4.57861 2.56152 5.15137 2 5.88135 2C6.24072 2 6.55518 2.12354 6.79102 2.37061L15.5508 10.9395C15.854 11.2314 15.9888 11.5571 16 11.939Z"
            fill={colors.neutral[900]}
          />
        </svg>
      )}

      <p className="text-base font-bold text-neutral-900">{title}</p>
      <div className="w-6 opacity-0" />
    </div>
  );
};

export default AuthHeader;
