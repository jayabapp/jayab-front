import { useStoreTheme } from "../../store";
import moment from "moment-jalaali";
import { useRouter } from "next/navigation";
const NotifCard = ({ item }: { item: any }) => {
  const router = useRouter();
  const onClick = () => {
    // let link = "";
    // if (type == "EMPLOYEE" && !!item?.data) {
    //   if (item?.data?.event_type == "RESERVE") {
    //     link = `/reserves/${item?.data?.event_id}`;
    //   }
    //   if (item?.data?.event_type == "TICKET") {
    //     link = `/profile/support/${item?.data?.event_id}`;
    //   }
    // } else if (type == "MANAGER") {
    //   if (item?.data?.event_type == "TICKET") {
    //     link = `/menu/support/tickets/${item?.data?.event_id}`;
    //   } else if (item?.data?.event_type == "RESERVE") {
    //     link = `/service-providers/${item?.data?.employee_id}/${item?.data?.event_id}`;
    //   }
    // }
    // if (!!link) {
    //   router.push(link);
    // }
  };
  return (
    <div
      onClick={onClick}
      className={`  ${
        !!item?.data?.event_id ? "cursor-pointer" : ""
      } py-2 px-3 bg-white/60 rounded-20 custome-shadow-card w-full flex flex-col  items-start justify-between `}
    >
      <div className="flex items-center gap-2 ">
        <img src="/assets/icons/header/blue_bell.svg" className=" w-4 h-4 md:h-5 md:w-5 aspect-square shrink-0" />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-sm  text-primary-700">{item?.title}</p>
          <p className=" text-sm">{item?.body}</p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-end text-primary-700 gap-1">
        <p className="text-xxs md:text-xs text-end w-full"> {moment(item?.created_at).format("HH:mm")}</p>
        <p className="text-xxs  md:text-xs"> {moment(item?.created_at).format("jYYYY/jMM/jDD")} </p>
      </div>
    </div>
  );
};

export default NotifCard;
