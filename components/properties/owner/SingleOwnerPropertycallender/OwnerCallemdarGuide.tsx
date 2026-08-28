import _STRINGS from "@/utils/LocalStrings";

const OwnerCallemdarGuide = ({ isAdvisor, isCustomer }: { isAdvisor?: boolean; isCustomer?: boolean }) => {
  return (
    <div className=" w-full flex flex-wrap gap-y-1 gap-x-5">
      <div className="flex text-neutral-500 text-sm items-center gap-2 ">
        <div className="w-5 h-5 striped !bg-neutral-200   rounded-md"></div>
        <p className=" text-xs md:text-sm">{_STRINGS.RESERVED_DAYS}</p>
      </div>
      {/*  ///////////////// */}
      {/* {!!isCustomer ? (
        <></>
      ) : ( */}
      <div className="flex text-neutral-500 text-sm items-center gap-2 ">
        <div className="w-5 h-5  !bg-neutral-200   rounded-md"></div>
        <p className=" text-xs md:text-sm">{_STRINGS.EMPTY_DAYS}</p>
      </div>
      {/* )}{" "} */}
      {/* /////////////////// */}
      <div className="flex text-neutral-500 text-sm items-center gap-2 ">
        <div className="w-3.5 h-0.5 bg-danger-500 rounded-full"></div>
        <p className=" text-xs md:text-sm">{_STRINGS.PEAK_DAYS}</p>
      </div>
      {/* /////////////////// */}
      {!!isAdvisor || !!isCustomer ? (
        <></>
      ) : (
        <div className="flex text-neutral-500 text-sm items-center gap-2 ">
          <div className="w-1 h-1 bg-brand-600 rounded-full"></div>
          <p className=" text-xs md:text-sm">{_STRINGS.MEMO_DAYS}</p>
        </div>
      )}
    </div>
  );
};

export default OwnerCallemdarGuide;
