import BlogsContainer from "@/components/blogs/BlogsContainer";
import MainImageTextBlock from "@/components/blogs/MainImageTextBlog";
import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import { Divider } from "@/components/shared/Divider";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL, apiRoutes, baseUrl } from "@/utils/urls";
import moment from "moment-jalaali";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import React from "react";

type Props = {
  params: Promise<{ id: string; blog_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { blog_id } = await params;

  const { data: blogData } = await serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_WITH_SLUG(blog_id));

  return {
    title: blogData?.seo?.metaTitle || blogData?.title,
    description: blogData?.seo?.metaDescription || blogData?.full_text,
  };
}

const SingleBlogPage = async ({ params }: Props) => {
  const { blog_id } = await params;

  const { data } = await serverCall(baseUrl + apiRoutes.SINGLE_CONTENT_WITH_SLUG(blog_id));
  const { data: blogs } = await serverCall(baseUrl + apiRoutes.CONTENTS + `?key=blog&page=1`);

  return (
    <div className="app-container relative   !overflow-visible">
      {!data ? (
        <> </>
      ) : (
        <SingleProductBreadCrumb
          dataArray={[
            { title: "خانه", link: "/" },
            { title: data?.category?.title || "", link: `/blog?sort=newest` },
            { title: data?.title || "", link: `#` },
          ]}
        />
      )}
      <div className="grid grid-cols-3   gap-4">
        {!data ? (
          <div className=" col-span-3 md:mt-6 ">
            {" "}
            <LottieLoading />{" "}
          </div>
        ) : (
          <div className=" col-span-3 md:col-span-3 md:mt-6 gap-4">
            <MainImageTextBlock data={data} />
            {/* <div className="w-full mt-2 flex items-center justify-between">
              <div className=" text-primary-700 ">
                <p className="  text-2xl font-bold ">{data?.title}</p>{" "}
                <p> {moment(data?.created_at).format("jYYYY/jMM/jDD")}</p>
              </div>
            </div> */}
            {/* {data?.feature_image ? (
              <div className="  py-8 w-full  aspect-[2.2] md:aspect-[2.2/1] relative">
                <Image
                  // onError={onImageError}
                  src={NEW_IMAGE_URL(data?.feature_image)}
                  fill
                  className="  md:object-cover  w-full  !rounded-20 aspect-[2.2] md:aspect-[2.2/1]  "
                  alt={data?.feature_image?.alt || data?.title}
                />
              </div>
            ) : (
              <div className="  py-8 w-full  aspect-[2.5/1] relative">
                <img
                  src={"/assets/icons/shared/place_holder.svg"}
                  className=" object-cover  w-full  aspect-[2.5/1] !rounded-20 "
                  alt={data?.feature_image?.alt || data?.title}
                />
              </div>
            )} */}
            <div className="flexflex-col mt-6 gap-8">
              {/* {data ? <Article data={data} key={`artivle`} /> : <></>} */}

              {data ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data?.html || data?.full_text,
                  }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className=" mt-8 px-3 md:px-10 lg:px-12 2xl:px-[10%] w-full">
              {" "}
              {!!blogs?.data && !!data ? (
                <BlogsContainer
                  data={blogs?.data?.filter((e: { id: string }) => e?.id !== data?.id) || []}
                  viewAllUrl="/blog"
                  title={_STRINGS?.OTHER_ARTICLS}
                />
              ) : (
                <></>
              )}
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleBlogPage;
