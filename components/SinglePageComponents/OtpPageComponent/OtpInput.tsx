"use client";
import React, { useState, ReactNode, useEffect, JSX } from "react";
interface props {
  setValue: (e: any) => void | null;
  refresh?: boolean;
  timer?: () => ReactNode;
}
interface inputType {
  [key: string]: string;
}
function OtpInput({ setValue, refresh = false, timer }: props): JSX.Element {
  // type inputs= inputType;
  // type setInputs= any;

  const [inputs, setInputs] = useState<inputType>({
    value1: "",
    value2: "",
    value3: "",
    value4: "",
  });
  //   const [input6, setInput6] = useState("");

  useEffect(() => {
    setValue(`${inputs.value1}${inputs.value2}${inputs.value3}${inputs.value4}`);
  }, [inputs]);
  useEffect(() => {
    setInputs({
      value1: "",
      value2: "",
      value3: "",
      value4: "",
    });
  }, [refresh]);
  const handleNextInput = (e: any) => {
    const fieldName = e.target.id;
    const fieldvalue = e.target.value;
    const nextSibiling = document.getElementById(`${Number(fieldName) + 1}`);

    if (nextSibiling !== null && fieldvalue.length > 0) {
      nextSibiling.focus();
    }
  };
  const handleLastInput = (e: any) => {
    const fieldName = e.target.id;
    const fieldvalue = e.target.value;
    const nextSibiling = document.getElementById(`${Number(fieldName) - 1}`);

    if (nextSibiling !== null && fieldvalue.length == 0) {
      nextSibiling.focus();
    }
  };

  const values = ["value1", "value2", "value3", "value4"];

  useEffect(() => {
    if ("OTPCredential" in window) {
      const ac = new AbortController();

      const navigatorHelper: any = navigator.credentials;

      navigatorHelper
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          if (!!otp.code) {
            setValue(`${otp.code}`);
          }
          if (!!otp && !otp.code) {
            setValue(`${otp}`);
          }
          setTimeout(() => {
            ac.abort();
          }, 20 * 1000);
        })
        .catch((err: any) => {
          setTimeout(() => {
            ac.abort();
          }, 20 * 1000);
          console.log(err.message);
        });
    }
  }, []);
  return (
    <div className="w-full flex flex-col gap-4">
      {" "}
      <div id="otp" className="flex flex-row justify-between items-center text-center mt-5 directon-ltr ">
        {values?.map((field, index) => (
          <input
            key={`input${index + 10}`}
            autoComplete="one-time-code"
            autoFocus={index == 0 ? true : false}
            className={` ${
              inputs[field] ? "border-primary-700 dark:border-zinc-400  " : " "
            } ltr  !text-lg border font-medium opacity-50 dark:opacity-80 !bg-white/80  dark:hover:border-zinc-400  dark:focus:border-zinc-400  hover:border-primary-700  focus:border-primary-700 h-14 w-16 text-center form-control rounded-10`}
            type="tel"
            id={`${index + 1}`}
            maxLength={1}
            value={inputs[field]}
            onChange={(e) => {
              if (e.target.value.length <= 1) {
                inputs[field] = e.target.value;
                setInputs({ ...inputs });
              }
            }}
            onKeyUp={(e) => {
              if (e?.code == "Backspace" || e?.code == "Delete" || e?.keyCode == 8) {
                handleLastInput(e);
              } else {
                handleNextInput(e);
              }
            }}
          />
        ))}
      </div>
      {timer && timer()}
    </div>
  );
}

export default OtpInput;
