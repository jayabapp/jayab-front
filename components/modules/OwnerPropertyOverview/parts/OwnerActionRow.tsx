import type { OwnerActionRowProps } from "@/types/components/modules/owner-property";
import { ContentImage } from "@elements/Image";

import Link from "next/link";

const toneClass = {
  brand: "border-neutral-200 text-brand-600",
  danger: "border-danger-500/50 text-danger-500",
  default: "border-neutral-200",
};

const OwnerActionRow = ({
  icon,
  href,
  badge,
  title,
  onClick,
  tone = "default",
}: OwnerActionRowProps) => {
  const body = (
    <>
      <div className="flex items-center gap-2">
        {icon}
        <p
          className={`text-sm font-bold ${tone === "brand" ? "text-brand-600" : ""} ${tone === "danger" ? "text-danger-500" : ""}`}
        >
          {title}
        </p>
        {badge}
      </div>
      {tone === "danger" ? (
        <ContentImage
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 aspect-square"
          src="/assets/icons/uploader/red_trash_icon.svg"
        />
      ) : (
        <ContentImage
          alt=""
          width={16}
          height={16}
          className="rotate-90"
          src="/assets/icons/shared/chevron.svg"
        />
      )}
    </>
  );

  const className = `w-full ${toneClass[tone]} flex items-center justify-between px-4 py-3 rounded-10 border`;

  if (href)
    return (
      <Link href={href} title={title} className={className}>
        {body}
      </Link>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} cursor-pointer`}
    >
      {body}
    </button>
  );
};

export default OwnerActionRow;
