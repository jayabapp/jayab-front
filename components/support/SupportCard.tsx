import type { SupportCardProps } from "@/types/features/support/components";

import StatusShower from "@/components/shared/StatusShower";
import moment from "moment-jalaali";
import Link from "next/link";

const SupportCard = ({ item, type }: SupportCardProps) => (
  <Link
    title={item.title}
    href={
      type === "complain"
        ? `/profile/complains/${item.id}`
        : `/profile/support/${item.id}`
    }
    className="custome-shadow-card flex flex-col gap-4 rounded-20 border bg-white p-4 "
  >
    <p className="text-sm font-medium md:text-base">{item.title}</p>
    <p className="content whitespace-pre-line text-justify text-xs leading-6 opacity-80 md:text-sm">
      {item.message}
    </p>
    <div className="flex w-full items-center justify-between">
      <StatusShower data={item.status} />
      <p className="text-xs">
        {moment(item.created_at).format("jYYYY/jMM/jDD")}
      </p>
    </div>
  </Link>
);

export default SupportCard;
