import { TicketDatum } from "@/api_services/support/support.interface";
import moment from "moment-jalaali";
import Link from "next/link";
import StatusShower from "../shared/StatusShower";

const SupportCard = ({ item, type }: { item: TicketDatum; type?: "complain" }) => {
  return (
    <Link
      title={item?.title}
      href={type == "complain" ? `/profile/complains/${item?.id}` : `/profile/support/${item?.id}`}
      className="flex flex-col  border  bg-white  custome-shadow-card rounded-20 dark:border dark:border-zinc-500 gap-4 p-4 "
    >
      <p className="text-sm md:text-base font-medium">{item?.title}</p>
      <p className="text-justify opacity-80 content  text-xs md:text-sm leading-6  whitespace-pre-line ">
        {item?.message}
      </p>
      <div className="flex items-center justify-between w-full">
        <StatusShower data={item?.status} />

        <p className="text-xs">{moment(item?.created_at)?.format("jYYYY/jMM/jDD")}</p>
      </div>
      {/* {item?.reply ? (
        <div className="flex border-t border-stone-900/10  pt-4  flex-col  gap-4  ">
          <div className="flex items-center justify-between w-full">
            {" "}
            <p className="text-sm md:text-base font-medium">{item?.reply?.title}</p>{" "}
            <p className="text-xs">{moment(item?.reply?.created_at)?.format("jYYYY/jMM/jDD")}</p>{" "}
          </div>
          <p className="text-justify opacity-80  text-xs md:text-sm leading-6  ">{item?.reply?.message}</p>
        </div>
      ) : (
        <></>
      )} */}
    </Link>
  );
};

export default SupportCard;
