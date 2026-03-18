import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern" });
type props = {
  date: string;
  year: string;
  month: string;
  prefix?: string;
  setDate?: (e: any | null) => void | null;
};

const YearMonthPicker = ({ date, setDate, month, year, prefix }: props) => {
  const nextMonth = () => {
    setDate?.(moment(date, "jYYYY/jMM/jDD").add(1, "month").format("jYYYY/jMM/jDD"));
  };
  const lastMonth = () => {
    setDate?.(moment(date, "jYYYY/jMM/jDD").subtract(1, "month").format("jYYYY/jMM/jDD"));
  };

  return (
    <div className={`flex snap-x w-full  ${!!setDate ? " justify-between" : "  justify-start "} items-center  px-4`}>
      {!!setDate ? (
        <div className="flex items-center gap-2">
          <img
            alt="`"
            className="cursor-pointer "
            src={"/assets/icons/property/arrow_right_callendar.svg"}
            onClick={() => {
              lastMonth();
            }}
          />
          <p className="text-xs text-primary-300">{_STRINGS.LAST_MONTH}</p>
        </div>
      ) : (
        <div> </div>
      )}
      <p className={` ${setDate ? "text-primary-500 font-medium  " : "  font-bold mb-4 text-primary-text"} text-sm f`}>
        {prefix}
        {month} {"  "} {year}
      </p>
      {!!setDate ? (
        <div className="flex items-center gap-2">
          <p className="text-xs text-primary-300 ">{_STRINGS.NEXT_MONTH}</p>
          <img
            alt="`"
            onClick={() => {
              nextMonth();
            }}
            className="cursor-pointer  -rotate-180 "
            src={"/assets/icons/property/arrow_right_callendar.svg"}
          />{" "}
        </div>
      ) : (
        <div> </div>
      )}
    </div>
  );
};

export default YearMonthPicker;
