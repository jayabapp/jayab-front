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
    <div className="flex px-4 py-4 flex-col w-full">
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
            className="rounded-full gap-4 py-0.5 px-2 pl-1 flex items-center justify-center border border-primary-700/30  bg-primary-700/5  text-xs "
          >
            <p className="text-sm cursor-pointer">{e?.title}</p>

            <div
              onClick={(t) => {
                t?.stopPropagation();
                filterSugges(e?.id);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700/30  flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/x_mark.svg"
                className="w-2.5 h-2.5    opacity-30 p-0.5  text-primary-text aspect-square "
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySuggPart;
