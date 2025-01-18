import React from "react";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";

const CityModalSearchPart = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <FormInput
      value={search}
      onChangeText={(e) => {
        setSearch(e);
      }}
      item={{
        containerClass: "relative",
        inputClass: "rounded-full",
        iconUrl: "/assets/icons/edit/magnifier.svg",
        iconUrlClassName: "w-5 !top-[29%] h-5",
        placeholder: _STRINGS.SEARCH_DESTINY,
      }}
    />
  );
};

export default CityModalSearchPart;
