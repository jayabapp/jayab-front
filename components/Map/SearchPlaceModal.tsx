import { useEffect, useRef, useState } from "react";
import { useMapAddressSearch } from "@features/map/hooks/useMapAddressSearch";

import type { SearchedLocation } from "@/types/features/map";

import SearchedLocItem from "./SearchedLocItem";
import FormInput from "@/components/shared/Form/FormInput";
import PopUpDown from "../PopUpDown";

type TSearchPlaceModalProps = {
  show: boolean;
  title: string;
  center: number[];
  setShow: (e: boolean) => void | null;
  setJumpTo: React.Dispatch<
    React.SetStateAction<{
      lat: string | number;
      lng: string | number;
    } | null>
  >;
};

const SearchPlaceModal = ({
  show,
  title,
  center,
  setShow,
  setJumpTo,
}: TSearchPlaceModalProps) => {
  const [search, setSearch] = useState("");
  const {
    addresses: searchedAddresses,
    isDebouncing,
    isFetching,
  } = useMapAddressSearch(search, center, show);

  const handleChange = (v: string) => {
    setSearch(v);
  };

  const closeFunc = () => {
    setShow(false);
  };
  const locationClickFunc = (e: SearchedLocation) => {
    setJumpTo({ lat: e?.location?.y, lng: e?.location?.x });
    closeFunc();
  };

  useEffect(() => {
    if (!show) return;
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 500);
    return () => window.clearTimeout(timeout);
  }, [show]);

  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <PopUpDown
      visible={show}
      setVisible={closeFunc}
      item={{ title: title, popHieghtType: "full-height" }}
    >
      <div className="w-full h-full flex flex-col gap-6 bg-white rounded-xl p-4">
        <FormInput
          value={search}
          onChangeText={(e) => handleChange(e)}
          item={{
            placeholder: title,
            containerClass: "w-full !relative",
            iconUrl: "/assets/icons/edit/magnifier.svg",
            iconUrlClassName: "!w-4 !top-[32%]",
            id: 1,
            passedRef: inputRef,
          }}
        />
        {isFetching || isDebouncing ? (
          <div className="h-1 w-full animate-pulse rounded bg-neutral-200" />
        ) : null}
        <div className="flex flex-col gap-4    items-center pb-8 ">
          {searchedAddresses?.length == 0 ? (
            <></>
          ) : (
            <>
              {searchedAddresses?.map((e, index) => (
                <SearchedLocItem
                  item={e}
                  locationClickFunc={locationClickFunc}
                  key={`searchedLoc${e?.category}${e?.title}${index}`}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </PopUpDown>
  );
};

export default SearchPlaceModal;
