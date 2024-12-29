import React, { useEffect, useState } from "react";

import { useStoreTheme } from "../../store";
import { NEW_IMAGE_URL } from "@/utils/urls";
import _STRINGS from "@/utils/LocalStrings";
const Splashscreen = () => {
  // const themes = JSON.parse(JSON.parse(JSON.stringify(localStorage.getItem("theme-storage") || "")));
  return (
    <div className="app-background relative flex flex-col  justify-center items-center mx-auto">
      <div className="h-[100dvh] object-cover app-size  !relative " style={{ backgroundColor: "white" }}>
        <div className="flex gap-4 z-2 flex-col w-full absolute top-[50%] items-center justify-center mt-2">
          <img src={"/assets/icons/logo/logo.svg"} className=" rounded-md  w-24 aspect-square " />
          <p className=" text-white text-center " style={{ fontSize: "1.5rem", fontWeight: 500 }}>
            {"_STRINGS.TITLE"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splashscreen;
