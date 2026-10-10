import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { JalaliDatePicker } from "@elements/JalaliCalendar";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import type { TPaymentDate } from "@/types/components/modules/profile";

import queryBuilder from "@/helpers/queryBuilder";
import moment from "moment-jalaali";
import Modal from "@elements/Modal";

const PaymentDateFilter = ({
  query,
  queryKey,
  placeholder,
}:TPaymentDate) => {
  const t = useTranslations("common");

  const searchParams = useSearchParams();
  const date = searchParams.get(queryKey);

  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  

  const setDate = (selectedDate: string | number | null) => {
    let temp = { ...query };
    if (date == selectedDate || !selectedDate) {
      delete temp?.[queryKey];
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,
        })}`,
      );
    } else {
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,

          [queryKey]: selectedDate,
        })}`,
      );
    }
  };

  const showModal = () => setShow(true);
  
  return (
    <div className="w-fit flex lg:flex-row  gap-3 items-center justify-between rounded-10  ">
      <div
        onClick={showModal}
        className="relative inline-block cursor-pointer text-left mr-1"
      >
        <div className=" h-11  rounded-10 cursor-pointer  flex justify-between items-center">
          <div
            className={`flex bg-white/50 ${
              date ? "custome-shadow-card" : ""
            }   border py-2 px-4 rounded-10 items-center gap-2`}
          >
            <p
              className={`  ${!!date ? "text-brand-600 font-medium" : "  opacity-60"}    text-sm`}
            >
              {" "}
              {!!date ? date : placeholder || t("pickDay")}
            </p>
            {!!date ? (
              <ContentImage
                alt=""
                width={12}
                height={12}
                src="/assets/icons/adds/x_mark.svg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDate("");
                }}
                className="  w-3 h-3 aspect-square  text-red-800"
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <Modal onHide={onHide} show={show}>
        <JalaliDatePicker
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

export default PaymentDateFilter;
