"use client";

import { BreadCrumbSchema } from "@elements/StructuredData";
import { allRoutes } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";
import { usePathname } from "next/navigation";
import { colors } from "@/theme/colors";
import { useMemo } from "react";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const crumbs = useMemo(() => {
    const segments = pathname
      .split("/")
      .filter((segment) => segment && isNaN(Number(segment)));

    return [
      { title: "خانه", route: "", icon: "" },
      ...segments.map((segment) => ({
        title: Object.prototype.hasOwnProperty.call(allRoutes, segment)
          ? allRoutes[segment]
          : decodeURIComponent(segment).replace(/-/g, " "),
        route: segment,
        icon: "",
      })),
    ];
  }, [pathname]);

  const createRoute = (route: string) => {
    const pathSegments = pathname.split("/");
    const index = pathSegments.indexOf(route);
    return pathSegments.slice(0, index + 1).join("/") || "/";
  };

  return (
    <div id="BREADCRUMB" className="md:pr-4 md:mt-4 mb-3 w-full">
      <BreadCrumbSchema breadcrumbs={crumbs} />
      <div className="flex w-11/12 flex-wrap">
        {crumbs.map((crumb, index, items) => (
          <a
            title={crumb.title}
            href={index + 1 !== items.length ? createRoute(crumb.route) : ""}
            key={`${crumb.route}-${index}`}
            className="flex flex-row items-center"
          >
            <div
              className={`${index === crumbs.length - 1 ? "" : "opacity-50"} justify-center cursor-pointer gap-2 flex rounded-md text-black`}
            >
              {!!crumb.icon ? (
                <ContentImage
                  alt=""
                  width={16}
                  height={16}
                  src={crumb.icon}
                  className="w-4 aspect-square h-4 opacity-60"
                />
              ) : (
                <></>
              )}
              <p
                className={`${index === crumbs.length - 1 ? "font-medium" : "opacity-50"} text-sm text-dark-700 transition-all hover:scale-110 hover:text-neutral-500`}
              >
                {crumb.title}
              </p>
            </div>
            {index < crumbs.length - 1 ? (
              <svg
                width="8"
                className="mx-2.5"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.13395 1.58023L6.07295 0.520235L0.29395 6.29723C0.200796 6.3898 0.126867 6.49988 0.0764193 6.62113C0.0259713 6.74238 0 6.87241 0 7.00373C0 7.13506 0.0259713 7.26509 0.0764193 7.38634C0.126867 7.50759 0.200796 7.61767 0.29395 7.71023L6.07295 13.4902L7.13295 12.4302L1.70895 7.00523L7.13395 1.58023Z"
                  fill={colors.neutral[300]}
                />
              </svg>
            ) : (
              <></>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
