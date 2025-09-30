"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Divider } from "@/components/shared/Divider";
import SimpleAccordion from "@/components/shared/SimpleAccorion";

import { useQuery } from "@tanstack/react-query";
import _STRINGS from "@/utils/LocalStrings";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { poolFilterTypes, SORT_TYPES } from "@/utils/constantss";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import SortMenu from "@/components/Filters/SortMenu";
import FilterdProperties from "@/components/Filters/FilterdProperties";
import Modal from "@/components/Modal";
import { ParsedUrlQuery } from "querystring";
import { PropertyService } from "@/api_services/property/property.service";
import ProductModels from "@/components/Filters/ProductModelx";
import Button from "@/components/shared/Button/Button";
import FilterCounter from "@/components/Filters/FilterCounter";
import FiltersPart from "./FiltersPart";
import FiltersSelectedFiltersShowcase from "@/components/Filters/FiltersSelectedFiltersShowcase";
import FilterPageCitiesTitle from "@/components/CityModal/FilterPageCitiesTitle";
import CityModal from "@/components/CityModal";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import PropertiesFilterList from "./PropertiesFilterList";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const Filterpage = () => {
  const [stickyHeight, setStickyHeight] = useState(600);
  const [cityButtonTItle, setCityTitleButton] = useState("");
  const [showCityModal, setShowCiyModal] = useState(false);
  const [defaultMobileFilters, setDefaultMobileFilters] = useState<any>({});
  const pathname = usePathname();
  const [filters, setFilters] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const [breadCrumbs, setBreadCrumbs] = useState<{ title: string; link: string }[]>([
    { title: "خانه", link: "/" },
    { title: "آگهی ها", link: "/rooms" },
  ]);
  const queriesParams = useQueryGet<any>();

  const [queries, setQueries] = useState(queriesParams);

  useEffect(() => {
    if (pathname == "/rooms") {
      setQueries(queriesParams);
      setDefaultMobileFilters(queriesParams);
      setFilters(queriesParams);
    }
  }, [searchParams]);

  const [sortType, setSortType] = useState<sortTypeType | undefined>(
    queries?.sort_type ? SORT_TYPES?.find((i) => i?.id == queries?.sort_type) : SORT_TYPES[0]
  );
  const [filterModalShow, setFilterModalShow] = useState(false);

  const { data: propertyTypes } = useQuery({
    queryFn: () => PropertyService.GetUserPropertyGroup({ group: ["PROPERTY_TYPE", "ENTERTAINMENT", "POOL_TYPE"] }),
    queryKey: [PropertyService.USER_PROP_OPTIONS_CACHEKEY, "PROPERTY_TYPE", "ENTERTAINMENT", "POOL_TYPE"],
  });

  const queryMaker = (items: any) => {
    const body = {
      ...items,
    };
    delete body.categories;

    setDefaultMobileFilters(body);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  /* -------------------------------------------------------------------------- */
  /*                                    CITY                                    */
  /* -------------------------------------------------------------------------- */
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

  return (
    <div className="app-container !px-0 xl:!px-10 lg:!px-12 2xl:!px-[5%] !pt-32  lg:!pt-20  xl: z-2  flex flex-col !gap-2 ">
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
          className={`col-span-12  md:col-span-12 lg:col-span-9 px-3 md:pr-4 md:pl-0  
   
            md:mt-0 `}
        >
          <div className=" hidden  z-1 w-full xl:flex flex-col xl:flex-row items-center justify-between ">
            {/* <Breadcrumbs /> */}
            <SingleProductBreadCrumb dataArray={breadCrumbs} />
          </div>
          {/* <div className="w-full hidden xl:flex ">
            {" "}
            <FiltersSelectedFiltersShowcase
              setFilterModalShow={setFilterModalShow}
              query={queries}
              propertyTypes={propertyTypes || {}}
            />
          </div> */}
          <div className="flex fixed pt-1 xl:hidden h-16 right-0  items-center justify-center   z-10 xl:z-1  top-[4rem] xl:top-auto left-0 xl:left-auto bg-white xl:bg-transparent xl:relative flex-col w-full xl:gap-2  ">
            <div className=" flex  order-1  xl:hidden  relative w-full">
              <div className=" z-1  px-2  relative  w-full items-center gap-1 justify-between  ">
                <div className=" !col-span-9 ">
                  <FiltersSelectedFiltersShowcase
                    setFilterModalShow={setFilterModalShow}
                    query={queries}
                    propertyTypes={propertyTypes || {}}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="  w-full flex xl:hidden">
            <PropertiesFilterList propertyKey={"property_type"} data={propertyTypes?.PROPERTY_TYPE} query={queries} />
          </div>
          <div className="w-full grow-0 shrink-0 flex flex-row  px-3 xl:px-0 relative  justify-between">
            <div className="flex  flex-row w-[90%]  items-center  gap-4 justify-start ">
              <FilterPageCitiesTitle title={cityButtonTItle} cb={showCityModalFunc} />
              <FiltersSelectedFiltersShowcase
                containerClass="   !hidden md:!contents "
                setFilterModalShow={setFilterModalShow}
                query={queries}
                propertyTypes={propertyTypes || {}}
              />
            </div>{" "}
            <SortMenu query={queries} />
          </div>
          {/* <div className="grid grid-cols-12 "> */}
          {/* SIDEBAR */}

          {/* LEFT SIDE */}

          <FilterdProperties sortType={sortType} setSortType={setSortType} query={queries} />
          {/* </div> */}
        </div>
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
        {/* <div className="flex sticky  pb-4 pt-4   w-full z-[60] bg-white dark:bg-zinc-600 justify-between items-center    top-0  border-b border-b-neutral-300 dark:border-b-zinc-600 ">
          <img
            src="/assets/icons/shared/close.svg"
            width={20}
            height={20}
            className={"dark:invert mr-4"}
            onClick={() => {
              setFilters(defaultMobileFilters);
              setFilterModalShow(false);
            }}
          />
        </div>
        <div>
          <Divider />
        </div> */}
        <ModalHeaderPart
          title={_STRINGS.FILTERS}
          onHide={() => {
            setFilters(defaultMobileFilters);
            setFilterModalShow(false);
          }}
        >
          <div
            onClick={() => {
              removeExtraFilters();
            }}
            className="absolute flex items-center gap-2 left-4"
          >
            <p className=" text-sm text-primary-700">{_STRINGS.REMOVE_FILTERS}</p>
            <img src="/assets/icons/property/blue_trash_icon.svg" />
          </div>
        </ModalHeaderPart>
        {/* BODY */}
        <div className="w-[90%] mx-auto">
          <div className=" w-full  pt-4 pb-8  ">
            <FilterPageCitiesTitle title={cityButtonTItle} cb={showCityModalFunc} />
            <FiltersPart propertyTypes={propertyTypes} filters={filters} setFilters={setFilters} queries={queries} />
          </div>
          <div className=" w-full   pb-6 fixed bottom-0 right-0  bg-white z-1 border-t  ">
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
        onSubmitCustomeCB={!!filterModalShow ? setFilters : undefined}
        customeValues={!!filterModalShow ? filters : false}
        show={showCityModal}
        onHide={hideCityModal}
        setTitle={setCityTitleButton}
      />
    </div>
  );
};

export default Filterpage;
