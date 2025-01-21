"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { ParsedUrlQuery } from "querystring";

import { Divider } from "@/components/shared/Divider";

import _STRINGS from "@/utils/LocalStrings";

import Breadcrumbs from "@/components/BreadCrumbs";
import Modal from "@/components/Modal";
import CategoryBlogs from "@/components/blogs/CategoryBlogs";

interface OtpQuery extends ParsedUrlQuery {
  id: string;
}

export interface PostPageQuery {
  searchParams: {
    slug: string[];
    categories: string;
    tags?: string;
    sort_type: string;
    max_price?: string;
    min_price?: string;
    store_name?: string;
    sorting_category?: string;
    store_id?: string;
    brands?: { id: number | string }[];
  };
  params: { id: string };
}
type sortTypeType = { id?: string; title?: string };

const Blogs = () => {
  const page = useSearchParams().get("page");

  const [filterModalShow, setFilterModalShow] = useState(false);

  return (
    <div className="app-container ">
      <div className="">
        {" "}
        <Breadcrumbs />
      </div>
      <div className="grid grid-cols-12 gap-2">
        {/* SIDEBAR */}
        <div className="grid grid-cols-12 gap-4 col-span-12 ">
          {/* LEFT SIDE */}

          <div className="col-span-12 md:col-span-12 lg:col-span-12 ">
            <CategoryBlogs queryPage={page} />
          </div>
        </div>
      </div>
      {/* <=======================================================================MODALS ================================================================> */}
      <Modal show={filterModalShow} onHide={() => setFilterModalShow(false)}>
        {/* HEADER */}
        <div className=" mx-2 my-2">
          <img
            src="/assets/icons/profile/close-icon.svg"
            width={20}
            height={20}
            className={"dark:invert"}
            onClick={() => {
              setFilterModalShow(false);
            }}
          />
        </div>
        <div>
          <Divider />
        </div>
        {/* BODY */}
        <div className="w-[90%] mx-auto">
          <div className=" w-full pb-8  ">
            {/* <SearchInResults /> */}

            {/* <SimpleAccordion item={{ noBorder: true, parenClass: " p-2 w-full" }} title={_STRINGS?.A20}>
              <ProductModels query={searchParams} />
            </SimpleAccordion> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Blogs;
