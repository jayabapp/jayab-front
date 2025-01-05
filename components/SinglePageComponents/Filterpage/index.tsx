"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Divider } from "@/components/shared/Divider";
import SimpleAccordion from "@/components/shared/SimpleAccorion";

import { useQuery } from "@tanstack/react-query";
import _STRINGS from "@/utils/LocalStrings";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { SORT_TYPES } from "@/utils/constantss";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import SortMenu from "@/components/Filters/SortMenu";
import FilterdProperties from "@/components/Filters/FilterdProperties";
import Modal from "@/components/Modal";
import { ParsedUrlQuery } from "querystring";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const Filterpage = () => {
  const [defaultMobileFilters, setDefaultMobileFilters] = useState<any>({});
  const pathname = usePathname();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [specs, setSpecs] = useState({});
  const [breadCrumbs, setBreadCrumbs] = useState<{ title: string; link: string }[]>([
    { title: "خانه", link: "/" },
    { title: "دسته بندی", link: "/products" },
  ]);
  const queriesParams = useQueryGet<any>();

  const [queries, setQueries] = useState(queriesParams);

  useEffect(() => {
    if (pathname.includes("/products")) {
      setQueries(queriesParams);
      setDefaultMobileFilters(queriesParams);
      setSpecs(queriesParams);
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

  const queryMaker = (items: any) => {
    const body = {
      ...items,
    };
    delete body.categories;

    setDefaultMobileFilters(body);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className="app-container z-2 ">
      <div className=" hidden  z-1 w-full md:flex flex-col md:flex-row items-center justify-between ">
        {/* <Breadcrumbs /> */}
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>

      <div className="flex fixed   z-10 md:z-1  top-[4.5rem] md:top-auto left-0 md:left-auto bg-white md:bg-transparent md:relative flex-col w-full md:gap-2  ">
        {" "}
        <div className=" flex  order-1  md:hidden  w-full">
          <div className="flex z-1  w-full items-center gap-4 justify-between  ">
            <img
              onClick={() => setFilterModalShow(true)}
              src="/assets/icons/products/filters_icons.svg"
              className="  cursor-pointer w-12 h-4 shrink-0"
            />
            {/* <Button
              width="!px-4 md:custome-shadow-card !w-full !gap-2"
              icon={
                <img
                  src="/assets/icons/products/setting_slider.svg"
                  className="cursor-pointer w-4 h-4 shrink-0  ml-2"
                />
              }
              onClick={() => setFilterModalShow(true)}
              variant="white"
              title={_STRINGS.FILTERS}
            /> */}

            <SortMenu query={queries} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 ">
        {/* SIDEBAR */}
        <div className="grid grid-cols-12  col-span-12 ">
          <div className="hidden gap-4 lg:flex h-fit flex-col items-center rounded-10  border col-span-3 ">
            {/* <SearchInResults /> */}
            <div className="  z-2 h-fit flex-col items-center p-3  bg-white dark:bg-zinc-800 rounded-xl w-full ">
              <div className="flex items-center gap-2 mb-4 ">
                <img src="/assets/icons/products/filters_icons.svg" />
                <p className="font-medium  text-lg">{_STRINGS.FILTERS}</p>
              </div>
              <SimpleAccordion
                item={{ noBorder: true, parenClass: "  pb-4  border-b w-full p-2" }}
                title={"_STRINGS?.B14"}
                isOpenFirst
              >
                s{/* <ProductModels queryKey={"parent_category"} list={parentCatsData} query={queries} /> */}
              </SimpleAccordion>
              {/* {!isEmpty(catsData) ? (
                <SimpleAccordion
                item={{ noBorder: true, parenClass: " p-2 w-full" }}
                title={_STRINGS?.B47}
                isOpenFirst={queries?.parent_category ? true : false}
                >
                  <ProductModels list={catsData} queryKey={"categories"} query={queries} />
                </SimpleAccordion>
                ) : (
                  <></>
                  )} */}
              {/* {!!brands?.data && !isEmpty(brands?.data) ? (
                <SimpleAccordion
                  item={{ noBorder: true, parenClass: "  border-b pb-4  p-2 w-full" }}
                  isOpenFirst={queries?.brands ? true : false}
                  title={_STRINGS?.BRANDS}
                >
                  <ProductModels isMulty list={brands?.data} queryKey={"brands"} query={queries} />
                </SimpleAccordion>
              ) : (
                <></>
              )} */}
              {/* <SimpleAccordion item={{ noBorder: true, parenClass: " p-2 w-full" }} title={_STRINGS?.A21}>
                <ColorFilter query={queries} />
                </SimpleAccordion> */}
              <SimpleAccordion item={{ noBorder: true, parenClass: " pb-4  p-2 w-full" }} title={"_STRINGS?.A22"}>
                r
                {/* <PriceRange
                  query={queries}
                  lowLimit={catsCategories?.price_range?.min_price}
                  upLimit={catsCategories?.price_range?.max_price}
                /> */}
              </SimpleAccordion>
              {/* <TopSwitchs query={queries} /> */}
            </div>
            {/* {!isEmpty(catsCategories?.specifications) ? (
              <div className="  h-fit flex-col w-full items-center   p-3  bg-white dark:bg-zinc-800 rounded-xl ">
                {catsCategories?.specifications?.map((e) => (
                  <SimpleAccordion
                    key={`specif${e?.id}`}
                    item={{ noBorder: true, parenClass: " p-2 w-full" }}
                    title={e?.title}
                  >
                    <DynamicCategoriesItems
                      setSpecs={setSpecs}
                      list={e?.options}
                      unit={e?.unit}
                      queryKey={"specifications"}
                      isMulty={true}
                      query={specs}
                      dynamicKey={e?.id}
                    />
                  </SimpleAccordion>
                ))}
                <Button
                  variant="primary"
                  title={_STRINGS?.A25}
                  size={"sm"}
                  onClick={() => {
                    router.replace(`${pathname}?${queryBuilder(specs)}`);
                    setFilterModalShow(false);
                  }}
                  width="w-full"
                  containerClass="w-full flex items-center flex-col ml-2"
                />
              </div>
            ) : (
              <></>
            )} */}
          </div>

          {/* LEFT SIDE */}

          <div
            className={`col-span-12  md:col-span-12 lg:col-span-9 px-0 md:px-4 
   
              md:mt-0 `}
          >
            <FilterdProperties sortType={sortType} setSortType={setSortType} query={queries} />
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
          setSpecs(defaultMobileFilters);
          setFilterModalShow(false);
        }}
      >
        {/* HEADER */}
        <div className="flex sticky  pb-4 pt-4   w-full z-[60] bg-white dark:bg-zinc-600 justify-between items-center    top-0  border-b border-b-neutral-300 dark:border-b-zinc-600 ">
          <img
            src="/assets/icons/profile/close-icon.svg"
            width={20}
            height={20}
            className={"dark:invert mr-4"}
            onClick={() => {
              setSpecs(defaultMobileFilters);
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
            <div className="flex items-center gap-2 mb-4 ">
              <img src="/assets/icons/products/filters_icons.svg" />
              <p className="font-medium  text-lg">{_STRINGS.FILTERS}</p>
            </div>
            {/* <SearchInResults /> */}
            {/* <TopSwitchs query={queries} setMobileFilters={setSpecs} mobileFilters={specs} /> */}
            <SimpleAccordion
              item={{ noBorder: true, parenClass: " border-b w-full p-2", invertIconDark: true }}
              title={"_STRINGS?.B14"}
              isOpenFirst
            >
              {/* <ProductModels
                setMobileFilters={setSpecs}
                mobileFilters={specs}
                list={parentCatsData}
                queryKey={"parent_category"}
                query={queries}
              /> */}{" "}
              sf
            </SimpleAccordion>
            {/* {catsData && catsData?.length > 0 ? (
              <SimpleAccordion
                item={{ noBorder: true, parenClass: " p-2 w-full", invertIconDark: true }}
                title={_STRINGS?.B47}
              >
                <ProductModels list={catsData} queryKey={"categories"} query={queries} />
              </SimpleAccordion>
            ) : (
              <></>
            )} */}
            {/* <SimpleAccordion item={{ noBorder: true, parenClass: " p-2 w-full" }} title={_STRINGS?.A21}>
              <ColorFilter query={queries} />
            </SimpleAccordion> */}
            {/* {!!brands?.data && !isEmpty(brands?.data) ? (
              <SimpleAccordion
                item={{ noBorder: true, parenClass: "  border-b p-2 w-full" }}
                isOpenFirst={queries?.brands ? true : false}
                title={_STRINGS?.BRANDS}
              >
                <ProductModels
                  setMobileFilters={setSpecs}
                  mobileFilters={specs}
                  isMulty
                  list={brands?.data}
                  queryKey={"brands"}
                  query={queries}
                />
              </SimpleAccordion>
            ) : (
              <></>
            )} */}
            {/* <SimpleAccordion
              item={{ noBorder: true, parenClass: " p-2 w-full", invertIconDark: true }}
              title={_STRINGS?.A22}
            >
              <PriceRange
                query={queries}
                lowLimit={catsCategories?.price_range?.min_price}
                upLimit={catsCategories?.price_range?.max_price}
              />
            </SimpleAccordion> */}
          </div>
          <div className=" w-full  pb-16  ">
            {" "}
            {/* {catsCategories && catsCategories?.specifications?.length > 0 ? (
              <div className=" h-fit flex-col w-full items-center  p-3  bg-gray-100 dark:bg-zinc-600 rounded-xl ">
                {catsCategories?.specifications?.map((e) => (
                  <SimpleAccordion
                    key={`specif${e?.id}`}
                    item={{ noBorder: true, parenClass: " p-2 w-full", invertIconDark: true }}
                    title={e?.title}
                  >
                    <DynamicCategoriesItems
                      setSpecs={setSpecs}
                      list={e?.options}
                      unit={e?.unit}
                      queryKey={"specifications"}
                      isMulty={true}
                      query={specs}
                      dynamicKey={e?.id}
                    />
                  </SimpleAccordion>
                ))}
              </div>
            ) : (
              <></>
            )} */}
            {/* <Button
              variant="primary"
              title={_STRINGS?.DO_THE_FILTERING}
              size={"sm"}
              onClick={() => {
                queryMaker(specs);
                // router.replace(`${pathname}?${queryBuilder(specs)}`);
                setFilterModalShow(false);
              }}
              width="w-full"
              containerClass="w-full flex items-center flex-col ml-2 pt-6"
            /> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Filterpage;
