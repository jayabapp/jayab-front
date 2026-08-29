"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Divider } from "@elements/Divider";

import CategoryBlogs from "@/components/blogs/CategoryBlogs";
import Breadcrumbs from "@/components/BreadCrumbs";
import Modal from "@elements/Modal";

export interface PostPageQuery {
  searchParams: {
    tags?: string;
    slug: string[];
    store_id?: string;
    categories: string;
    sort_type: string;
    max_price?: string;
    min_price?: string;
    store_name?: string;
    sorting_category?: string;
    brands?: { id: number | string }[];
  };
  params: { id: string };
}
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
      <Modal show={filterModalShow} onHide={() => setFilterModalShow(false)}>
        {/* HEADER */}
        <div className=" mx-2 my-2">
          <img
            src="/assets/icons/profile/close-icon.svg"
            width={20}
            height={20}
            className={""}
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
          <div className=" w-full pb-8  "></div>
        </div>
      </Modal>
    </div>
  );
};

export default Blogs;
