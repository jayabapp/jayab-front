"use client";
import { allRoutes } from "@/utils/constantss";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BreadCrumbSchema } from "../SchemaGenerator/Schemas";

const Breadcrumbs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [crumbs, setCrumbs] = useState<
    {
      title: string;
      route: string;
      icon?: string;
    }[]
  >([]);

  useEffect(() => {
    _findPath();
  }, [router]);
  const _findPath = () => {
    const { pathname } = window?.location || {};
    if (!pathname) return;

    let pathArray = pathname?.split("/");
    pathArray = pathArray.filter((e) => isNaN(Number(e)));
    let crumbsArray = [{ title: "خانه", route: "", icon: "" }];
    pathArray.map((e) => {
      if (allRoutes.hasOwnProperty(e)) crumbsArray.push({ title: allRoutes[e], route: e, icon: "" });
      else crumbsArray.push({ title: decodeURIComponent(e)?.replace(/-/g, " ") || "", route: e, icon: "" });
    });
    setCrumbs(crumbsArray);
  };
  // const _createRoute = (item: { title: string; route: string }) => {
  //   let pathArray = pathname.split("/");
  //   const index = pathArray.indexOf(item.route);
  //   const finalPath = pathArray.slice(0, index + 1).join("/");
  //   router.push(finalPath || "/");
  // };
  const _createRouteATag = (item: { title: string; route: string }) => {
    let pathArray = pathname.split("/");
    const index = pathArray.indexOf(item.route);
    const finalPath = pathArray.slice(0, index + 1).join("/");
    return finalPath || "/";
  };
  return (
    <div id="BREADCRUMB" className="pr-4 mt-4 mb-3 w-full  hidden md:flex ">
      <BreadCrumbSchema breadcrumbs={crumbs} />
      <div className="flex w-11/12 flex-wrap">
        {crumbs?.map((e, i, arr) => (
          <a
            href={i + 1 !== arr?.length ? _createRouteATag(e) : ""}
            key={i}
            className={`  flex flex-row items-center my-1 `}
          >
            <div
              className={`${
                i == crumbs?.length - 1 ? "  bg-primary-700/10" : " opacity-50"
              } justify-center  cursor-pointer gap-2 flex py-1 px-2  rounded-md  bg-primary-500 text-black`}
            >
              {" "}
              {!!e?.icon ? <img src={e?.icon} className="w-4 aspect-square h-4 opacity-60 " /> : <></>}{" "}
              <p
                className={`${
                  i == crumbs?.length - 1 ? "font-medium " : " opacity-50"
                }  text-sm text-dark-700  transition-all hover:scale-110 hover:text-primary-800 dark:hover:text-primary-800 dark:text-gray-400 `}
              >
                {e.title}
              </p>{" "}
            </div>
            {i < crumbs?.length - 1 && (
              <svg
                width="8"
                className="mx-2.5  "
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.13395 1.58023L6.07295 0.520235L0.29395 6.29723C0.200796 6.3898 0.126867 6.49988 0.0764193 6.62113C0.0259713 6.74238 0 6.87241 0 7.00373C0 7.13506 0.0259713 7.26509 0.0764193 7.38634C0.126867 7.50759 0.200796 7.61767 0.29395 7.71023L6.07295 13.4902L7.13295 12.4302L1.70895 7.00523L7.13395 1.58023Z"
                  fill="#DCDCDC"
                />
              </svg>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
