import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
type SuggsType = { title: string; id: string };

const HistorySuggPart = ({ handleChange }: { handleChange: (e: string) => void | null }) => {
  const [historySuggs, setHistorySuggs] = useState<SuggsType[]>([]);

  useEffect(() => {
    setHistorySuggs(
      localStorage?.getItem("search_history") ? JSON.parse(localStorage?.getItem("search_history") || "[]") : [],
    );
  }, []);
  const filterSugges = (id: string) => {
    const newSuggArr = historySuggs?.filter((e) => e?.id !== id);

    setHistorySuggs(newSuggArr);
    localStorage.setItem("search_history", JSON.stringify(newSuggArr));
  };
  return (
    <div className="flex px-4 pb-1 flex-col w-full">
      {!isEmpty(historySuggs) ? (
        <div className=" w-full flex items-center  gap-2 mb-2">
          {/* <img src="/assets/icons/edit/magnifier.svg" className="w-4 h-4 " /> */}
          <p className="  text-sm md:text-base md:font-medium">{_STRINGS.UR_SEARCH_HISTORY}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full flex flex-wrap gap-2">
        {historySuggs?.map((e) => (
          <div
            key={e?.id}
            onClick={() => handleChange(e?.title)}
            className="w-fit opacity-80 border rounded-full px-2 gap-2 flex justify-between items-center"
          >
            <p className=" text-xs cursor-pointer">{e?.title}</p>
            <img
              src="/assets/icons/adds/x_mark.svg"
              onClick={(t) => {
                t?.stopPropagation();
                filterSugges(e?.id);
              }}
              className="cursor-pointer w-1.5 h-1.5 opacity-65"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySuggPart;
