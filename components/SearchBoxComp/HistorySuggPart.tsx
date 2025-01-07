import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import React, { useState } from "react";
type SuggsType = { title: string; id: string };

const HistorySuggPart = ({ handleChange }: { handleChange: (e: string) => void | null }) => {
  const [historySuggs, setHistorySuggs] = useState<SuggsType[]>(
    localStorage?.getItem("search_history") ? JSON.parse(localStorage?.getItem("search_history") || "[]") : []
  );

  const filterSugges = (id: string) => {
    const newSuggArr = historySuggs?.filter((e) => e?.id !== id);

    setHistorySuggs(newSuggArr);
    localStorage.setItem("search_history", JSON.stringify(newSuggArr));
  };
  return (
    <div className="flex flex-col w-full">
      {!isEmpty(historySuggs) ? (
        <div className=" w-full flex items-center  gap-4">
          <img src="/assets/icons/adds/x_mark.svg" className="w-5 h-5 " />
          <p className="font-medium">{_STRINGS.UR_SEARCH_HISTORY}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full flex flex-wrap gap-2">
        {historySuggs?.map((e) => (
          <div
            key={e?.id}
            onClick={() => handleChange(e?.title)}
            className="w-fit border rounded-md px-2 gap-2 flex justify-between items-center"
          >
            <p className="font-medium cursor-pointer">{e?.title}</p>
            <img
              src="/assets/icons/adds/x_mark.svg"
              onClick={(t) => {
                t?.stopPropagation();
                filterSugges(e?.id);
              }}
              className="cursor-pointer w-3"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySuggPart;
