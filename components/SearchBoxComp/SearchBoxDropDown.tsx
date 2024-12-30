"use client";
import { debounce, isEmpty } from "lodash";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SmallLoading from "../Loading/SmallLoading";
import { Menu, Transition } from "@headlessui/react";
import { CustomerHomeSearchResultDto } from "@repo/api/dto/shared.dto";
import Link from "next/link";
import CategoriesIcon from "../DynamicIcons/CategoriesIcon";
import _STRINGS from "../../../../utils/LocalStrings";
interface props {
  initValue?: string | undefined;
  placeholder?: string;
  cancelText?: string;
  containerClass?: string;
  autofocus?: boolean;
  boxId?: string;
  color?: string;

  onSubmit: (e: string | null) => void | null;
  onClear: () => void | null;
  errors?: { [key: string]: string[] };
  item?: {
    bg?: string;
  };
  list: CustomerHomeSearchResultDto | undefined;
}

const SearchBoxDropDown = ({
  placeholder = "search...",
  cancelText = "لغو",
  onSubmit,
  autofocus = false,
  initValue,
  onClear,
  containerClass = "w-[90%] mx-auto",
  item,
  boxId = "SEARCH_BOX",
  color,
  list,
}: props) => {
  const searchParam = useSearchParams().get("q");
  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState(initValue || "");
  const [showResults, setShowResults] = useState(false);
  const [isTyping, setisTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [element, setElement] = useState<HTMLInputElement | null>(null);
  useEffect(() => {
    setElement(document.getElementById(boxId) as HTMLInputElement);
  }, []);

  useEffect(() => {
    autofocus && inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (searchParam) {
      setText(searchParam);
      typeof onSubmit == "function" && onSubmit(searchParam);
    }
  }, [searchParam]);

  useEffect(() => {
    if (!isTyping) {
      // inputRef.current.blur();
      typeof onSubmit == "function" && element && onSubmit(element.value);

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [isTyping]);

  const checkTyping = useCallback(
    debounce(() => {
      setisTyping(false);
    }, 1000),
    []
  );
  useEffect(() => {
    if (!element?.value && !searchParam) {
      onSubmit("");
      cancelSearch();
    }
  }, [searchParam]);

  function handleChange(text: string) {
    setText(text);
    setisTyping(true);
    checkTyping();
  }

  const cancelSearch = () => {
    if (element) {
      setText("");
      setShowResults(false);
      element.value = "";
      typeof onSubmit == "function" && onSubmit("");
      onClear();
    }
  };
  const SORT_TYPES = [
    { id: "new", title: "جدیدترین" },
    { id: "cheapest", title: "ارزان ترین" },
    { id: "expensive", title: "گران ترین" },
    { id: "best_sellers", title: "پرفروش ترین" },
  ];

  useEffect(() => {
    if (!!list && !!text) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [list, text]);

  return (
    <div className={containerClass}>
      <Menu as="div" className="relative w-full  inline-block text-left ">
        {" "}
        <div
          className={`bg-white/50 rounded-20  w-full  overflow-hidden dark:bg-slate-800   pr-4 pl-2 py-3 custome-shadow-card flex justify-between items-center  ${item?.bg}`}
        >
          <div className="mr-2">
            <MagnifyingGlassIcon color={color} width={30} height={30} />
          </div>{" "}
          <div className="flex items-center w-full">
            <input
              id={boxId}
              ref={inputRef}
              placeholder={placeholder}
              className={`bg-transparent dark:bg-slate-800 py-1 pl-0.5 pr-3 outline-none placeholder:text-[${color}70] w-full ${item?.bg} `}
              onChange={(v) => handleChange(v.target.value)}
              value={text}
            />
          </div>
          <div className="inline-flex w-1/4 justify-end">
            {loading && (
              <div className="ml-2">
                <SmallLoading />
              </div>
            )}

            {element?.value && (
              <div className="text-primary-700 text-xs mr-2 cursor-pointer " onClick={cancelSearch}>
                {cancelText}
              </div>
            )}
          </div>{" "}
        </div>
        <Transition
          show={showResults}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute w-full  md:top-auto left-0 z-20  mt-2  origin-top-center  rounded-xl bg-white dark:bg-zinc-800 custome-shadow-card focus:outline-none  overflow-scroll">
            <div
              onBlur={() => {
                setShowResults(false);
              }}
              onMouseLeave={() => {
                // setShowResults(false);
              }}
              className="flex gap-2 items-center flex-col px-2 py-2 border-b border-gray-275 dark:border-zinc-500 "
            >
              {isEmpty(list?.employees) && isEmpty(list?.subCategories) ? <p>{_STRINGS.NODATA_LIST}</p> : <></>}{" "}
              {list?.employees.map((e) => (
                <Menu.Item key={e.id}>
                  <Link href={`/employees/${e?.id}`} prefetch={false} className={`w-full   cursor-pointer relative`}>
                    <p className="text-sm text-black dark:text-zinc-300 opacity-70 text-start">
                      {" "}
                      {e?.first_name} {e?.last_name}
                    </p>
                  </Link>
                </Menu.Item>
              ))}
              {list?.subCategories.map((e) => (
                <Menu.Item key={e.id}>
                  <Link
                    href={`/categories/${e?.parent?.id}?sub_category=${e?.id}`}
                    prefetch={false}
                    className={`w-full flex items-center gap-2   cursor-pointer relative`}
                  >
                    <CategoriesIcon />{" "}
                    <p className="text-sm text-black dark:text-zinc-300 opacity-70 text-start"> {e?.title}</p>
                  </Link>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SearchBoxDropDown;
