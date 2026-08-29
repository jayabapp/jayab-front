import _STRINGS from "@/utils/LocalStrings";
import React from "react";
import { FormInput } from "@elements/Form";

const CityModalSearchPart = ({
  search,
  setSearch,
  options,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  options?: { placeholder?: string };
}) => {
  return (
    <div className="flex items-center w-full relative ">
      <FormInput
        value={search}
        onChangeText={(e) => {
          setSearch(e);
        }}
        item={{
          containerClass: "relative w-full",
          inputClass: "rounded-full",
          iconUrl: "/assets/icons/edit/magnifier.svg",
          iconUrlClassName: "w-5 !top-[29%] h-5",
          placeholder: options?.placeholder || _STRINGS.SEARCH_DESTINY,
        }}
      />

      <img
        onClick={() => {
          setSearch("");
        }}
        className={` cursor-pointer absolute left-4 w-3 h-3  z-5 ${
          !!search ? "opacity-75" : " opacity-0"
        } transition-all  `}
        src="/assets/icons/adds/x_mark.svg"
      />
    </div>
  );
};

export default CityModalSearchPart;
