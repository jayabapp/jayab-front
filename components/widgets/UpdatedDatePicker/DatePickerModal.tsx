import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import DatePicker from "./index";
// import CalenderIcon from "../../DynamicIcons/CalenderIcon";
// import CircularArrowLeft from "../../DynamicIcons/CircularArrowLeft";
// import CircularArrowRight from "../../DynamicIcons/CircularArrowRight";
import Modal from "@elements/Modal";
const DatePickerModal = ({
  date,
  setDate,
}: {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [show, setShow] = useState(false);
  const onHide = () => {
    setShow(false);
  };
  const onShowCalender = () => {
    setShow(true);
  };

  const nextDay = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").add(1, "day").format("jYYYY/jMM/jDD"));
  };
  const lastDay = () => {
    setDate(moment(date, "jYYYY/jMM/jDD").subtract(1, "day").format("jYYYY/jMM/jDD"));
  };

  useEffect(() => {
    setShow(false);
  }, [date]);
  return (
    <>
      <div className=" w-full md:w-[80%] flex items-center justify-between">
        <img
          src=""
          onClick={() => {
            lastDay();
          }}
          className={" cursor-pointer"}
        />
        <div
          onClick={onShowCalender}
          className=" w-[55%] cursor-pointer relative flex items-center justify-center  rounded-10 shadow-xl bg-white/70"
        >
          <div className="flex flex-col ">
            <p className=" font-semibold text-center "> {moment(date, "jYYYY/jMM/jD").format("ddd")}</p>
            <p className="text-center text-sm ">{date}</p>
          </div>
          <img src="" className=" right-4 absolute" />
        </div>
        <img
          src=""
          onClick={() => {
            nextDay();
          }}
          className={" cursor-pointer"}
        />
      </div>
      <Modal onHide={onHide} show={show}>
        <DatePicker setSelectedDay={setDate} selectedDate={date} />
      </Modal>
    </>
  );
};

export default DatePickerModal;
