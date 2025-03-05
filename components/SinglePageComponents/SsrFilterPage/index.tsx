"use client";

import { useEffect, useState } from "react";
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Divider } from "@/components/shared/Divider";
import { useQuery } from "@tanstack/react-query";
import _STRINGS from "@/utils/LocalStrings";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { poolFilterTypes, SORT_TYPES } from "@/utils/constantss";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import SortMenu from "@/components/Filters/SortMenu";
import Modal from "@/components/Modal";
import { ParsedUrlQuery } from "querystring";
import { PropertyService } from "@/api_services/property/property.service";
import Button from "@/components/shared/Button/Button";
import FiltersPart from "./FiltersPart";
import FiltersSelectedFiltersShowcase from "@/components/Filters/FiltersSelectedFiltersShowcase";
import SsrClinetPartFilterProperties from "@/components/Filters/SsrClinetPartFilterProperties";
import { SingleLandingDto } from "@/api_services/property/property.interface";
import { isArray, isEmpty, last } from "lodash";
import SsrPartFilter from "@/components/Filters/SsrPartFilter";
import CityModal from "@/components/CityModal";
import FilterPageCitiesTitle from "@/components/CityModal/FilterPageCitiesTitle";
import SsrFilterPageContents from "./SsrFilterPageContents";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const SsrFilterPage = ({ landings, firstData }: { firstData: { data: any[] }; landings: SingleLandingDto }) => {
  const [cursor, setCursor] = useState(0);
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

    setQueries({ ...defaults, ...queriesParams });
    setDefaultMobileFilters({ ...defaults, ...queriesParams });
    setFilters({ ...defaults, ...queriesParams });
  }, [landings?.query]);

  // useEffect(() => {
  //   if (pathname.includes("/rooms")) {
  //     setQueries(queriesParams);
  //     setDefaultMobileFilters(queriesParams);
  //     setFilters(queriesParams);
  //   }
  // }, [searchParams]);

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
    // router.replace(`${pathname}?${queryBuilder(body)}`);
    router.replace(`rooms?${queryBuilder(body)}`);
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
  return (
    <div className="app-container !pt-32  lg:!pt-20  md: z-2 ">
      <div className=" hidden  z-1 w-full md:flex flex-col md:flex-row items-center justify-between ">
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>
      <h1 className="mb-3 text-lg font-medium">{landings?.content?.title}</h1>
      <div className="w-full hidden md:flex  pb-4">
        {" "}
        <FiltersSelectedFiltersShowcase
          setFilterModalShow={setFilterModalShow}
          query={queries}
          propertyTypes={propertyTypes || {}}
        />
      </div>

      <div className="flex fixed  pt-1 md:hidden h-16 right-0  items-center justify-center   z-10 md:z-1  top-[4rem] md:top-auto left-0 md:left-auto bg-white md:bg-transparent md:relative flex-col w-full md:gap-2  ">
        {" "}
        <div className=" flex  order-1  md:hidden  relative w-full">
          <div className=" z-1  pr-2  relative  w-full items-center gap-1 justify-between  ">
            <div className=" !col-span-9 ">
              {" "}
              <FiltersSelectedFiltersShowcase
                setFilterModalShow={setFilterModalShow}
                query={queries}
                propertyTypes={propertyTypes || {}}
              />
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="w-full pb-3 flex flex-row   justify-between">
        <FilterPageCitiesTitle title={cityButtonTItle} cb={showCityModalFunc} />
        <SortMenu query={queries} />
      </div>
      <div className="grid grid-cols-12  min-h-[80dvh] mb-8 md:mb-4">
        {/* SIDEBAR */}
        <div className="grid grid-cols-12  col-span-12 ">
          <div className="hidden gap-4 lg:flex h-fit flex-col items-center rounded-10  border col-span-3 ">
            <FiltersPart propertyTypes={propertyTypes} filters={filters} setFilters={setFilters} queries={queries} />
            <Button
              title={_STRINGS?.DO_THE_FILTERING}
              onClick={() => {
                queryMaker(filters);
                // router.replace(`${pathname}?${queryBuilder(specs)}`);
                setFilterModalShow(false);
              }}
              width="w-full"
              containerClass="w-full flex items-center flex-col px-2 pb-2 pt-6"
            />
          </div>

          {/* LEFT SIDE */}

          <div
            className={`col-span-12  md:col-span-12 lg:col-span-9 px-0 md:px-4 
   
              md:mt-0 `}
          >
            <SsrPartFilter firstData={firstData?.data} />
            {cursor == 0 && !isEmpty(firstData?.data) && firstData?.data?.length % 50 == 0 ? (
              <Button
                onClick={() => {
                  setCursor(last(firstData?.data)?.id || 0);
                }}
                title={_STRINGS.SHOW_MORE}
                containerClass="w-full flex items-center justify-center"
              />
            ) : (
              <></>
            )}
            <SsrClinetPartFilterProperties cursor={cursor} setCursor={setCursor} sortType={sortType} query={queries} />
          </div>
        </div>
      </div>
      {/*  CONTENT PART */}

      <SsrFilterPageContents data={landings} />
      {/* <=======================================================================MODALS ================================================================> */}
      <Modal
        options={{
          containerClass:
            "mx-auto  my-0 md:my-10  h-full   w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 overflow-y-scroll  bg-white pb-32  dark:bg-zinc-800",
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
            <FilterPageCitiesTitle title={cityButtonTItle} cb={showCityModalFunc} />
            <FiltersPart propertyTypes={propertyTypes} filters={filters} setFilters={setFilters} queries={queries} />
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
        passedUrl="/rooms"
        onSubmitCustomeCB={!!filterModalShow ? setFilters : undefined}
        customeValues={!!filterModalShow ? filters : false}
        show={showCityModal}
        onHide={hideCityModal}
        setTitle={setCityTitleButton}
      />
    </div>
  );
};

export default SsrFilterPage;
