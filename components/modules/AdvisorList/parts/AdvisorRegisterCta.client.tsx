"use client";

import type { AdvisorRegisterCtaProps } from "@/types/components/modules/advisors";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Link from "next/link";

const AdvisorRegisterCta = ({
  advisorId,
  onRegister,
  isSpecialAdvisor,
}: AdvisorRegisterCtaProps) => {
  if (!advisorId)
    return (
      <Button
        variant="outline"
        onClick={onRegister}
        width=" w-full md:w-fit"
        roundedClass="rounded-full"
        title={_STRINGS.REGISTER_ADVISOR}
        containerClass="w-full md:col-span-3 hidden md:flex md:w-fit items-center justify-center"
      />
    );

  if (isSpecialAdvisor) return null;

  return (
    <Link
      title={_STRINGS.REGISTER_AS_SPECIAL_AD}
      href="/profile/advisor/subscription/is-especial"
      className="w-full md:w-fit px-12 md:col-span-4 rounded-full flex items-center justify-center gap-4 h-12 bg-success-600"
    >
      <ContentImage
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 aspect-square"
        src="/assets/icons/home/white_star_tick.svg"
      />
      <p className="text-white">{_STRINGS.REGISTER_AS_SPECIAL_AD}</p>
    </Link>
  );
};

export default AdvisorRegisterCta;
