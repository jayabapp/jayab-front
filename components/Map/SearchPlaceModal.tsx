import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import SearchedLocItem from "./SearchedLocItem";
import getAddresses from "./SearchAddress";
import FormInput from "@/components/shared/Form/FormInput";
import PopUpDown from "../PopUpDown";
import debounce from "lodash/debounce";

export interface SearchedLOCType {
  type: string;
  title: string;
  region: string;
  address: string;
  category: string;
  location: Location;
  neighbourhood: string;
}

export interface Location {
  x: number;
  y: number;
  z: string;
}

const SearchPlaceModal = ({
  show,
  title,
  center,
  setShow,
  setJumpTo,
}: {
  show: boolean;
  setShow: (e: boolean) => void | null;
  title: string;
  center: number[];
  setJumpTo: React.Dispatch<
    React.SetStateAction<{
      lat: string | number;
      lng: string | number;
    } | null>
  >;
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [searchedAddresses, setSearchedAddresses] = useState<any[]>([]);
  const [firstTime, setFirstTime] = useState(true);
  const [loading, setLoading] = useState(false);
  const checkTyping = useCallback(
    debounce(() => {
      setIsTyping(false);
      setFirstTime(false);
    }, 1000),
    [],
  );

  const handleChange = (v: string) => {
    setSearch(v);
    setIsTyping(true);
    checkTyping();
  };

  useMemo(() => {
    if (search.length >= 0 && !isTyping && !firstTime) {
      setTimeout(
        () =>
          getAddresses({
            center,
            search: search,
            setSearchedAddressLoading: setLoading,
            setSearchedAddress: setSearchedAddresses,
          }),
        1000,
      );
    }
  }, [search, isTyping]);

  const closeFunc = () => {
    setShow(false);
  };
  const locationClickFunc = (e: SearchedLOCType) => {
    setJumpTo({ lat: e?.location?.y, lng: e?.location?.x });
    closeFunc();
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
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
        <div className="flex flex-col gap-4    items-center pb-8 ">
          {searchedAddresses?.length == 0 ? (
            <></>
          ) : (
            <>
              {searchedAddresses?.map((e: SearchedLOCType, index: number) => (
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
