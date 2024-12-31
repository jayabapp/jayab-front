"use client";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStoreTheme } from "../../store";
import SmallLoading from "../shared/Lotties/SmallLoading";
interface props {
    initValue?: string | undefined;
    placeholder?: string;
    cancelText?: string;
    containerClass?: string;
    autofocus?: boolean;
    boxId?: string;

    onSubmit: (e: string | null) => void | null;
    onClear: () => void | null;
    errors?: { [key: string]: string[] };
    item?: {
        bg?: string;
    };
}

const SearchBox = ({
    placeholder = "search...",
    cancelText = "لغو",
    onSubmit,
    autofocus = false,
    initValue,
    onClear,
    containerClass = "w-[90%] mx-auto",
    item,
    boxId = "SEARCH_BOX",
}: props) => {
    const searchParam = useSearchParams().get("q");

    const inputRef = useRef<HTMLInputElement>(null);

    const [text, setText] = useState(initValue || "");

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
            }, 1000);
        }
    }, [isTyping]);

    const checkTyping = useCallback(
        debounce(() => {
            setisTyping(false);
        }, 500),
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
            element.value = "";
            typeof onSubmit == "function" && onSubmit("");
            onClear();
        }
    };

    return (
        <div className={containerClass}>
            <div
                className={`bg-white/50 rounded-20   overflow-hidden dark:bg-slate-800   pr-4 pl-2 py-3 custome-shadow-card flex justify-between items-center  ${item?.bg}`}
            >
                <div className="mr-2">
                    <img
                        src="/assets/icons/edit/magnifier.svg"
                        width={30}
                        height={30}
                    />
                </div>{" "}
                <div className="flex items-center w-full">
                    <input
                        id={boxId}
                        ref={inputRef}
                        placeholder={placeholder}
                        className={`bg-transparent dark:bg-slate-800 py-1 pl-0.5 pr-3 outline-none placeholder:text-gray-400 w-full ${item?.bg} `}
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
                        <div
                            className="text-primary-700 text-xs mr-2 cursor-pointer "
                            onClick={cancelSearch}
                        >
                            {cancelText}
                        </div>
                    )}
                </div>{" "}
            </div>
        </div>
    );
};

export default SearchBox;
