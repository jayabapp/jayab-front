"use client";
import { useRouter } from "next/navigation";
import { BreadCrumbSchema } from "../SchemaGenerator/Schemas";

const SingleProductBreadCrumb = ({ dataArray }: { dataArray: { title: string; link: string }[] }) => {
  const router = useRouter();
  const _createRoute = (item: string) => {
    router.push(item || "/");
    // window.location.replace(item || "/");
  };

  return (
    <div id="BREADCRUMB" className={`pr-0 md:pr-0 z-5  w-[90vw]   `}>
      <BreadCrumbSchema breadcrumbs={dataArray} />
      <div className="flex w-11/12 gap-1 md:gap-2 flex-wrap">
        {dataArray?.map((e, index, arr) => (
          <a
            title={e?.title}
            key={e?.link}
            className="flex flex-row items-center  gap-1 md:gap-2 "
            href={e?.link}
            // onClick={() => {
            //   if (index + 1 !== arr?.length) _createRoute(e?.link);
            // }}
          >
            {" "}
            <div
              className={`${
                index == arr?.length - 1 ? "  " : " opacity-50"
              } justify-center  cursor-pointer gap-2 flex  rounded-md   text-black`}
            >
              {e?.link == "/" ? (
                // <img src={"/assets/icons/shared/breadcrumb_home.svg"} className="w-4 opacity-60 aspect-square h-4" />
                <></>
              ) : (
                <></>
              )}{" "}
              <p
                className={`  text-xxs md:text-sm text-dark-700  transition-all   dark:hover:text-primary-800 dark:text-gray-400 ${
                  index == arr?.length - 1 ? "font-normal hover:text-primary-800 " : " hover:opacity-100 opacity-50"
                }`}
              >
                {e.title}
              </p>{" "}
            </div>
            {index < arr?.length - 1 && (
              <svg
                width="8"
                className="  w-[6px] h-[12px] md:w-2 md:h-[14px]  mx-0.5 md:mx-2.5  "
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

export default SingleProductBreadCrumb;
