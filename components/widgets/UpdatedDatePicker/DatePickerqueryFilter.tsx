import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import moment from "moment-jalaali";
import Modal from "../../Modal";
import DatePicker from "./index";

const DatePickerqueryFilter = ({ query }: any) => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");

  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const onHide = () => {
    setShow(false);
  };
  //   const [selectedCat, setSelectedCat] = useState<{ title: string; id: number } | null>(null);

  // const { data: storeData } = useQuery([BusinessServices.SINGLE_BUSINESSES_CACHEKEY, storeId], () =>
  //   BusinessServices.GetSingleBusiness({ id: storeId })
  // );

  const setDate = (selectedDate: string | number | null) => {
    let temp = { ...query };

    if (date == selectedDate || !selectedDate) {
      delete temp.date;
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,
        })}`
      );
    } else {
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,

          date: selectedDate,
        })}`
      );
    }
  };

  const showModal = () => {
    setShow(true);
  };
  return (
    <div className="w-fit flex lg:flex-row  gap-3 items-center justify-between rounded-10  ">
      <div onClick={showModal} className="relative inline-block text-left mr-1">
        <div className=" h-11  rounded-10 cursor-pointer  flex justify-between items-center">
          <div className="flex bg-white/50 custome-shadow-card  border py-2 px-4 rounded-10 items-center gap-2">
            {!!date ? (
              <img
                alt="close_mark"
                src="/assets/icons/adds/x_mark.svg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDate("");
                }}
                className="  w-4 h-4 aspect-square  text-red-800"
              />
            ) : (
              // <CallenderTimeShiftIcon className="mix-blend-multiply" />
              <></>
            )}
            <p className="text-brand-50 font-medium text-sm"> {!!date ? date : "همه روز ها"}</p>
            {/* <ChevronArrow /> */}
          </div>
        </div>
      </div>
      <Modal onHide={onHide} show={show}>
        <DatePicker
          setSelectedDay={(e) => {
            setDate(e);
            onHide();
          }}
          selectedDate={!!date ? `${date}` : moment().format("jYYYY/jMM/jDD")}
        />
      </Modal>
    </div>
  );
};

export default DatePickerqueryFilter;
