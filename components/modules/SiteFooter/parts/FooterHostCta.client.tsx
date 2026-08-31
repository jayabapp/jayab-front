"use client";

import type { FooterHostCtaProps } from "@/types/components/modules/site-footer";
import { useAuthStore } from "@/store";

import Button from "@elements/Button";
import Link from "next/link";

const FooterHostCta = ({ link, title }: FooterHostCtaProps) => {
  const { isLogin } = useAuthStore((state) => state);

  return (
    <Link
      title={title}
      target="_blank"
      className="shrink-0"
      referrerPolicy="no-referrer"
      href={isLogin ? link : `/auth?redirect_url=${link}`}
    >
      <Button
        title={title}
        color="themeLight"
        roundedClass="rounded-full"
        width="w-fit !px-12 !text-brand-600"
      />
    </Link>
  );
};

export default FooterHostCta;
