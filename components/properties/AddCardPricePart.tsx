import numberWithCommas from "@/helpers/numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";

const AddCardPricePart = ({
  data,
  containerClass,
  ribbon,
}: {
  data: { price?: number; discounted_price?: number; discount_percentage?: number };
  containerClass?: string;
  ribbon?: {
    ribbon_title_color?: string;
    ribbon_bg_color?: string;
    ribbon_title?: string;
  };
}) => {
  return (
    <div className={`${containerClass || " flex flex-col  w-fit gap-0 md:gap-0"}   `}>
      {ribbon?.ribbon_title ? (
        <div
          style={{ background: ribbon?.ribbon_bg_color, color: ribbon?.ribbon_title_color }}
          className="absolute left-[-70px] top-4 z-10 w-[200px] -rotate-45  py-0.5  text-xs flex items-center justify-center text-center font-medium  shadow-md"
        >
          {ribbon?.ribbon_title}
        </div>
      ) : (
        <></>
      )}

      {!!data?.discounted_price ? (
        <>
          {" "}
          <div className=" relative gap-2 flex items-center">
            <p className="text-xs md:text-xs relative  flex items-center line-through  opacity-65">
              {" "}
              {numberWithCommas(data?.price)}
            </p>
            {data?.discount_percentage ? (
              <div className="w-7 gap-0.5 flex-col h-5 rounded-full transition-all  px-1 py-[0.2rem]   bg-danger-500 text-white  aspect-square flex items-center justify-center">
                <p className="  text-xxs   ">%{data?.discount_percentage}</p>{" "}
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}

      <p className="font-bold text-sm">
        {numberWithCommas(!!data?.discounted_price ? data?.discounted_price : data?.price)}{" "}
        <span className="text-xxs">{_STRINGS.TOMAN}</span>
      </p>
    </div>
  );
};

export default AddCardPricePart;
