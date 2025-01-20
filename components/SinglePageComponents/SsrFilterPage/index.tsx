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
import SsrClinetPartFilterProperties from "@/components/Filters/SsrClinetPartFilterProperties";
import { SingleLandingDto } from "@/api_services/property/property.interface";
import { isArray } from "lodash";
import SsrPartFilter from "@/components/Filters/SsrPartFilter";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const SsrFilterPage = ({ landings, firstData }: { firstData: any; landings: SingleLandingDto }) => {
  const [cursor, setCursor] = useState(0);

  const [defaultMobileFilters, setDefaultMobileFilters] = useState<any>({});
  const pathname = usePathname();
  const [filters, setFilters] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const [breadCrumbs, setBreadCrumbs] = useState<{ title: string; link: string }[]>([
    { title: "خانه", link: "/" },
    { title: "دسته بندی", link: "/s" },
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

  useEffect(() => {
    if (pathname.includes("/s")) {
      setQueries(queriesParams);
      setDefaultMobileFilters(queriesParams);
      setFilters(queriesParams);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   setSpecs({ ...queries });
  // }, [queries?.parent_category]);

  const [sortType, setSortType] = useState<sortTypeType | undefined>(
    queries?.sort_type ? SORT_TYPES?.find((i) => i?.id == queries?.sort_type) : SORT_TYPES[0]
  );
  const [filterModalShow, setFilterModalShow] = useState(false);

  // const { data: parentCatsData, isLoading: parentCatsLoading } = useQuery(
  //   [PropertyService?.CATEGORIES_PARENTS_CACHEKEY],
  //   PropertyService?.GetCategoriesParents,
  //   {
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );

  // const { data: catsData, isLoading: catsLoading } = useQuery(
  //   [PropertyService?.CATEGORIES_CACHEKEY, queries?.parent_category, queries.brands],
  //   () => {
  //     if (!!queries?.parent_category) return PropertyService?.GetCategories({ parent_id: queries?.parent_category });
  //   },
  //   {
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );

  // const { data: catsCategories, isLoading: catsCategoriesLoading } = useQuery(
  //   [ProductService?.GET_SINGLE_CATEGORY_CACHEKEY, queries?.parent_category],
  //   () => {
  //     if (queries?.parent_category) return ProductService?.GetCategorieSpecifications({ id: queries?.parent_category });
  //   },
  //   {
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );
  // const { data: brands } = useQuery([HomeService.GET_BRANDS_CACHEKEY], HomeService.GetBrands);

  // useEffect(() => {
  //   if (!isEmpty(catsData?.breadcrumb)) {
  //     const params = catsData?.breadcrumb?.map((e, index, arr) => {
  //       if (index == 0) {
  //         return { title: e?.title, link: `/products?parent_category=${e?.id}&sort_type=new` };
  //       } else {
  //         return {
  //           title: e?.title,
  //           link: `/products?parent_category=${arr?.[0]?.id}&sort_type=new&categories=${e?.id}`,
  //         };
  //       }
  //     });

  //     if (!!params) {
  //       setBreadCrumbs([{ title: "خانه", link: "/" }, ...params]);
  //     }
  //   } else {
  //     setBreadCrumbs([
  //       { title: "خانه", link: "/" },
  //       { title: "دسته بندی", link: "/products" },
  //     ]);
  //   }
  // }, [catsData, queries?.parent_category, queries?.category]);

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

  return (
    <div className="app-container !pt-32  lg:!pt-28  md: z-2 ">
      <div className=" hidden  z-1 w-full md:flex flex-col md:flex-row items-center justify-between ">
        {/* <Breadcrumbs /> */}
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>
      <div className="w-full hidden md:flex  pb-4">
        {" "}
        <FiltersSelectedFiltersShowcase query={queries} propertyTypes={propertyTypes || {}} />
      </div>
      <div className="flex fixed border-b  md:hidden h-10 right-0  items-center justify-center   z-10 md:z-1  top-[4.5rem] md:top-auto left-0 md:left-auto bg-white md:bg-transparent md:relative flex-col w-full md:gap-2  ">
        {" "}
        <div className=" flex  order-1  md:hidden  relative w-full">
          <div className="grid grid-cols-10 z-1  relative  w-full items-center gap-0 justify-center  ">
            <img
              onClick={() => setFilterModalShow(true)}
              src="/assets/icons/property/filter_icon.svg"
              className=" col-span-1  cursor-pointer w-12 h-5 shrink-0"
            />
            <div className=" !col-span-9 ">
              {" "}
              <FiltersSelectedFiltersShowcase query={queries} propertyTypes={propertyTypes || {}} />
            </div>{" "}
            {/* <SortMenu query={queries} /> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 ">
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

            <SsrClinetPartFilterProperties cursor={cursor} setCursor={setCursor} sortType={sortType} query={queries} />
          </div>
        </div>
      </div>
      {/* <=======================================================================MODALS ================================================================> */}
      <Modal
        options={{
          containerClass:
            "mx-auto  my-0 md:my-10  h-full   w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 overflow-y-scroll  bg-white pb-32  dark:bg-zinc-800",
        }}
        show={filterModalShow}
        onHide={() => {
          setFilters(defaultMobileFilters);
          setFilterModalShow(false);
        }}
      >
        {/* HEADER */}
        <div className="flex sticky  pb-4 pt-4   w-full z-[60] bg-white dark:bg-zinc-600 justify-between items-center    top-0  border-b border-b-neutral-300 dark:border-b-zinc-600 ">
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
        </div>
        {/* BODY */}
        <div className="w-[90%] mx-auto">
          <div className=" w-full  pt-4 pb-8  ">
            <FiltersPart propertyTypes={propertyTypes} filters={filters} setFilters={setFilters} queries={queries} />
          </div>
          <div className=" w-full  pb-16  ">
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
    </div>
  );
};

export default SsrFilterPage;
