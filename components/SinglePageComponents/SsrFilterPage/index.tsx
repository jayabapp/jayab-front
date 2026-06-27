"use client";

import { ChildCities } from "@/api_services/city/city.interface";
import { SingleLandingDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import CityModal from "@/components/CityModal";
import FilterPageCitiesTitle from "@/components/CityModal/FilterPageCitiesTitle";
import RegionModal from "@/components/CityModal/RegionModal";
import FiltersSelectedFiltersShowcase from "@/components/Filters/FiltersSelectedFiltersShowcase";
import SortMenu from "@/components/Filters/SortMenu";
import SpecialFilterButtons from "@/components/Filters/SpecialFilterButtons";
import SsrClinetPartFilterProperties, { removeKeyArray } from "@/components/Filters/SsrClinetPartFilterProperties";
import SsrPartFilter from "@/components/Filters/SsrPartFilter";
import Modal from "@/components/Modal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import Button from "@/components/shared/Button/Button";
import { DeviceInfo } from "@/helpers/device.detector";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { SORT_TYPES, zero_filter_remove_keys } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isArray, isEmpty, throttle } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import FiltersPart from "./FiltersPart";
import SsrFilterPageContents from "./SsrFilterPageContents";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const SsrFilterPage = ({
  landings,
  firstData,
  devices,
}: {
  firstData: { data: any[] };
  landings: SingleLandingDto;
  devices: DeviceInfo;
}) => {
  const [showRegions, setShowRegions] = useState(false);

  const [cityWithRegions, setCityWithRegions] = useState<ChildCities | null>(null);
  const [hiddenFilters, setHiddenFilters] = useState<string[]>([]);
  const [stickyHeight, setStickyHeight] = useState(600);
  const [showCityModal, setShowCiyModal] = useState(false);
  const [defaultMobileFilters, setDefaultMobileFilters] = useState<any>({});
  const pathname = usePathname();
  const [filters, setFilters] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityButtonTItle, setCityTitleButton] = useState("");
  const [breadCrumbs, setBreadCrumbs] = useState<{ title: string; link: string }[]>([
    { title: "خانه", link: "/" },
    { title: landings?.content?.title || "آگهی ها", link: "" },
  ]);

  const queriesParams = useQueryGet<any>();
  const [queries, setQueries] = useState(queriesParams);

  useEffect(() => {
    let defaults: any = {};
    if (!!landings?.query) {
      Object.keys(landings?.query)?.map((e) => {
        if (isArray(landings?.query?.[e])) {
          return (defaults[e] = `${landings?.query?.[e]?.map((x) => x)}`);
        } else return (defaults[e] = landings?.query?.[e]);
      });
    }

    /* -------------------------------------------------------------------------- */
    /*                        FILTERD KEYS COMING FROM SLUG                       */
    /* -------------------------------------------------------------------------- */

    // setHiddenFilters(Object.keys(landings?.query));
    /////////
    setQueries({ ...defaults, ...queriesParams });
    setDefaultMobileFilters({ ...defaults, ...queriesParams });
    setFilters({ ...defaults, ...queriesParams });
  }, [landings?.query]);

  const [sortType, setSortType] = useState<sortTypeType | undefined>(
    queries?.sort_type ? SORT_TYPES?.find((i) => i?.id == queries?.sort_type) : SORT_TYPES[0],
  );
  const [filterModalShow, setFilterModalShow] = useState(false);

  const { data: propertyTypes } = useQuery({
    queryFn: () =>
      PropertyService.GetUserPropertyGroup({
        group: [
          "PROPERTY_TYPE",
          "ENTERTAINMENT",
          "POOL_TYPE",
          "OWNERSHIP",
          "KITCHEN",
          "COOL_HEAT",
          "WELFARE",
          "PATTERN",
        ],
      }),
    queryKey: [
      PropertyService.USER_PROP_OPTIONS_CACHEKEY,
      "PROPERTY_TYPE",
      "ENTERTAINMENT",
      "POOL_TYPE",
      "OWNERSHIP",
      "KITCHEN",
      "COOL_HEAT",
      "WELFARE",
      "PATTERN",
    ],
  });

  const queryMaker = (items: any) => {
    const body = {
      ...items,
    };
    delete body.categories;
    removeKeyArray(hiddenFilters, body);
    for (let index = 0; index < zero_filter_remove_keys.length; index++) {
      if (body?.[zero_filter_remove_keys[index]] == 0) {
        delete body?.[zero_filter_remove_keys[index]];
      }
    }
    setDefaultMobileFilters(body);
    router.replace(`${pathname}?${queryBuilder(body)}`);
    // router.replace(`rooms?${queryBuilder(body)}`);
  };

  const hideCityModal = () => {
    setShowCiyModal(false);
  };
  const showCityModalFunc = () => {
    setShowCiyModal(true);
  };

  /* -------------------------------------------------------------------------- */
  /*                               FILTER REMOVAL                               */
  /* -------------------------------------------------------------------------- */

  const removeExtraFilters = () => {
    const body = {
      sort_type: queries?.sort_type,
      cities: queries.cities,
      q: queries?.q,
    };

    setFilterModalShow(false);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  useEffect(() => {
    setStickyHeight((window.visualViewport?.height || 700) - 90);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                  SCROLL Y                                  */
  /* -------------------------------------------------------------------------- */

  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);

    return () => window?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = throttle((event) => {
    if (window?.scrollY > 20) setShowShadow(true);
    else setShowShadow(false);
  }, 100);
  return (
    <>
      {/* FIlters shoCasE */}
      <div
        className={`flex fixed  ${
          !!showShadow ? "shadow-md" : ""
        }  md:shadow-none pt-1 transition-all duration-300 xl:hidden h-16 right-0  items-center justify-center   z-10 xl:z-1  top-[3rem] xl:top-auto left-0 xl:left-auto bg-white xl:bg-transparent xl:relative flex-col w-full xl:gap-2  `}
      >
        {" "}
        <div className=" flex  order-1  xl:hidden  relative w-full">
          <div className=" z-1  pr-2  relative  w-full items-center gap-1 justify-between  ">
            <div className=" !col-span-9 ">
              {" "}
              <FiltersSelectedFiltersShowcase
                setShowRegions={setShowRegions}
                cityWithRegions={cityWithRegions}
                hiddenFilters={hiddenFilters}
                setFilterModalShow={setFilterModalShow}
                query={queries}
                propertyTypes={propertyTypes || {}}
              />
            </div>{" "}
          </div>
        </div>
      </div>
      {/* ////////////////////////////////// */}
      <div className="app-container  !pt-[7.5rem]  lg:!pt-20  !relative z-2 ">
        <div className="grid grid-cols-12  col-span-12 ">
          <div
            style={{ height: `${stickyHeight}px` }}
            className="hidden   justify-between   overflow-y-hidden    gap-4 lg:sticky lg:top-20 lg:flex  flex-col items-center rounded-10  border col-span-3 "
          >
            <div className=" w-full flex flex-col gap-4 overflow-y-scroll">
              <FiltersPart propertyTypes={propertyTypes} filters={filters} setFilters={setFilters} queries={queries} />
            </div>
            <Button
              title={_STRINGS?.DO_THE_FILTERING}
              onClick={() => {
                queryMaker(filters);
                // router.replace(`${pathname}?${queryBuilder(specs)}`);
                setFilterModalShow(false);
              }}
              width="w-full"
              containerClass="w-full flex items-center flex-col px-2 pb-2 pt-0"
            />
          </div>{" "}
          <div
            className={`col-span-12  md:col-span-12 lg:col-span-9 px-0 md:pr-4 md:pl-0  
   
            md:mt-0 `}
          >
            <div className=" hidden  mb-2    z-1 w-full xl:flex flex-col xl:flex-row items-center justify-between ">
              <SingleProductBreadCrumb dataArray={breadCrumbs} />
            </div>
            <div className="mb-3  w-full flex items-center justify-between">
              <h2 className=" text-lg font-medium text-black">{landings?.content?.title}</h2>
              <div className="w-fit   items-center justify-end  hidden lg:flex">
                <SpecialFilterButtons query={queries} />
                <SortMenu query={queries} />
              </div>
            </div>

            <div className="w-full grow-0 shrink-0 flex flex-row  px-1 xl:px-0 relative  justify-between">
              <div className="flex  flex-row   items-center justify-start  gap-1 ">
                <div className=" flex lg:hidden ">
                  {" "}
                  <SpecialFilterButtons containerClass=" !w-full   lg:!w-fit" query={queries} />
                </div>
                {(!hiddenFilters?.includes("cities") || !!cityWithRegions) && !hiddenFilters?.includes("provinces") ? (
                  <FilterPageCitiesTitle
                    cityWithRegions={cityWithRegions}
                    queries={queries}
                    setShowRegions={setShowRegions}
                    showRegions={showRegions}
                    title={cityButtonTItle}
                    hideCityPart
                    // hideCityPart={
                    //   !!hiddenFilters?.includes("cities") &&
                    //   !!cityWithRegions?.child &&
                    //   !hiddenFilters?.includes("provinces")
                    // }
                    cb={showCityModalFunc}
                  />
                ) : (
                  <div> </div>
                )}
                <FiltersSelectedFiltersShowcase
                  cityWithRegions={cityWithRegions}
                  setShowRegions={setShowRegions}
                  hiddenFilters={hiddenFilters}
                  containerClass="   !hidden xl:!contents "
                  setFilterModalShow={setFilterModalShow}
                  query={(() => {
                    let temp = { ...queries };
                    removeKeyArray(hiddenFilters, temp);

                    return temp;
                  })()}
                  propertyTypes={propertyTypes || {}}
                />
              </div>{" "}
              <div className="w-fit flex lg:hidden">
                <SortMenu query={queries} />
              </div>
            </div>
            <div className="  min-h-[80dvh] mb-12 xl:mb-20">
              {/* SIDEBAR */}

              {/* LEFT SIDE */}

              {firstData?.data ? <SsrPartFilter firstData={firstData?.data} devices={devices} /> : <></>}
              {(queriesParams?.page == 1 || !queriesParams?.page) &&
              !isEmpty(firstData?.data) &&
              firstData?.data?.length % 30 == 0 ? (
                <Button
                  onClick={() => {
                    let temp = { ...queries };
                    removeKeyArray(hiddenFilters, temp);
                    window?.history?.replaceState(
                      {},
                      "",
                      `${pathname}?${queryBuilder({
                        ...temp,
                        page: 2,
                      })}`,
                    );
                  }}
                  title={_STRINGS.SHOW_MORE}
                  containerClass="w-full mt-6 flex items-center justify-center"
                />
              ) : (
                <></>
              )}
              <SsrClinetPartFilterProperties
                pageQuery={queriesParams?.page}
                sortType={sortType}
                query={queries}
                hiddenFilters={hiddenFilters}
              />
            </div>
            <SsrFilterPageContents data={landings} />
          </div>
          {/*  CONTENT PART */}
        </div>
        {/* <=======================================================================MODALS ================================================================> */}
        <Modal
          options={{
            containerClass:
              "mx-auto  my-0 xl:my-10  h-full   w-full xl:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 overflow-y-scroll  bg-white pb-32  dark:bg-zinc-800",
          }}
          show={filterModalShow && !showCityModal}
          onHide={() => {
            setFilters(defaultMobileFilters);
            setFilterModalShow(false);
          }}
        >
          {/* HEADER */}
          <ModalHeaderPart
            title={_STRINGS.FILTERS}
            onHide={() => {
              setFilters(defaultMobileFilters);
              setFilterModalShow(false);
            }}
          />

          {/* BODY */}
          <div className="w-[90%] mx-auto">
            <div className=" w-full  pt-4 pb-8  ">
              {(!hiddenFilters?.includes("cities") || !!cityWithRegions) && !hiddenFilters?.includes("provinces") ? (
                <FilterPageCitiesTitle
                  cityWithRegions={cityWithRegions}
                  setShowRegions={setShowRegions}
                  showRegions={showRegions}
                  queries={queries}
                  title={cityButtonTItle}
                  hideCityPart
                  cb={showCityModalFunc}
                />
              ) : (
                <div> </div>
              )}

              <FiltersPart
                hiddenFilters={hiddenFilters}
                propertyTypes={propertyTypes}
                filters={filters}
                setFilters={setFilters}
                queries={queries}
              />
            </div>
            <div className=" w-full   pb-6 fixed bottom-0 right-0 bg-white z-1 border-t  ">
              {" "}
              <Button
                title={_STRINGS?.DO_THE_FILTERING}
                onClick={() => {
                  queryMaker(filters);
                  // router.replace(`${pathname}?${queryBuilder(specs)}`);
                  setFilterModalShow(false);
                }}
                width="w-full"
                containerClass="w-full flex items-center flex-col px-2 pb-2 pt-6"
              />{" "}
            </div>
          </div>
        </Modal>
        <CityModal
          setRegionsCb={setCityWithRegions}
          passedUrl={pathname}
          onSubmitCustomeCB={!!filterModalShow ? setFilters : undefined}
          customeValues={filters}
          // customeValues={!!filterModalShow ? filters : false}
          show={showCityModal}
          onHide={hideCityModal}
          setTitle={setCityTitleButton}
        />
        <RegionModal
          cityWithRegions={cityWithRegions}
          show={showRegions}
          onHide={() => {
            setShowRegions(false);
          }}
        />{" "}
      </div>{" "}
    </>
  );
};

export default SsrFilterPage;
