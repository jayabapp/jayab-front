import moment from "moment-jalaali";
import React, { useEffect, useState } from "react";
import DatePicker from "./index";
// import CalenderIcon from "../../DynamicIcons/CalenderIcon";
// import CircularArrowLeft from "../../DynamicIcons/CircularArrowLeft";
// import CircularArrowRight from "../../DynamicIcons/CircularArrowRight";
import Modal from "../../Modal";
const DatePickerModal = ({
  date,
  setDate,
  title,
}: {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
  title: string;
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
      <div
        onClick={onShowCalender}
        className=" w-full bg-neutral-100 px-2  h-12  cursor-pointer relative flex items-center justify-center  rounded-10     "
      >
        <div className="flex flex-col ">
          <p className={`text-center text-sm ${!!date ? " font-medium " : " opacity-50"} `}>{!!date ? date : title}</p>
        </div>
      </div>

      <Modal onHide={onHide} show={show}>
        <DatePicker setSelectedDay={setDate} selectedDate={date} />
      </Modal>
    </>
  );
};

export default DatePickerModal;
