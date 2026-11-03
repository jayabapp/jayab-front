"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { AdvisorRegisterCtaProps } from "@/types/components/modules/advisors";

import Button from "@elements/Button";
import Link from "next/link";

const AdvisorRegisterCta = ({
  advisorId,
  onRegister,
  isSpecialAdvisor,
}: AdvisorRegisterCtaProps) => {
  const t = useTranslations();

  if (!advisorId)
    return (
      <Button
        variant="outline"
        onClick={onRegister}
        width=" w-full md:w-fit"
        roundedClass="rounded-full"
        title={t("header.registerAdvisor")}
        containerClass="w-full md:col-span-3 hidden md:flex md:w-fit items-center justify-center"
      />
    );

  if (isSpecialAdvisor) return null;

  return (
    <Link
      title={t("advisor.registerAsSpecialAd")}
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
      <p className="text-white">{t("advisor.registerAsSpecialAd")}</p>
    </Link>
  );
};

export default AdvisorRegisterCta;
