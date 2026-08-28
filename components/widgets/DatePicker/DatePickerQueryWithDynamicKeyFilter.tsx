import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, Fragment, useState } from "react";

import { Menu, Transition } from "@headlessui/react";
import { useStoreTheme } from "../../../store";
import Modal from "../../Modal";
import DatePicker from "./index";
import moment from "moment-jalaali";
import queryBuilder from "@/helpers/queryBuilder";

const DatePickerQueryWithDynamicKeyFilter = ({
  query,
  placeholder,
  queryKey,
}: {
  queryKey: string;
  query: any;
  placeholder?: string;
}) => {
  const searchParams = useSearchParams();
  const date = searchParams.get(queryKey);

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
      delete temp?.[queryKey];
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,
        })}`
      );
    } else {
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,

          [queryKey]: selectedDate,
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
          <div
            className={`flex bg-white/50 ${
              date ? "custome-shadow-card" : ""
            }   border py-2 px-4 rounded-10 items-center gap-2`}
          >
            <p className={`  ${!!date ? "text-brand-600 font-medium" : "  opacity-60"}    text-sm`}>
              {" "}
              {!!date ? date : placeholder || "انتخاب روز"}
            </p>
            {!!date ? (
              <img
                src="/assets/icons/adds/x_mark.svg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDate("");
                }}
                className="  w-3 h-3 aspect-square  text-red-800"
              />
            ) : (
              // <CallenderTimeShiftIcon className="mix-blend-multiply" />
              <></>
            )}
          </div>
        </div>
      </div>
      <Modal onHide={onHide} show={show}>
        <DatePicker
          smallerDateFonts
          freeDaysOfMonth
          setSelectedDay={(e) => {
            setDate(e);
            onHide();
          }}
          selectedDate={!!date ? `${date}` : moment().format("jYYYY jMM jDD")}
        />
      </Modal>
    </div>
  );
};

export default DatePickerQueryWithDynamicKeyFilter;
