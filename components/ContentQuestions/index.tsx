"use client";

import { Meta, QuestionDto } from "@/api_services/home/home.interface";
import { HomeService } from "@/api_services/home/home.service";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import Button from "../shared/Button/Button";
import Pagination from "../shared/Pagination";
import { CommentComponent } from "./CommentComponent";
import { QuestionForm } from "./QuestionForm";
import BtnLoading from "../shared/Button/BtnLoading";

export const ContentQuestions: FC<{
  containerClass?: string;
  defaultCount?: number;
  title?: string;
  contentId?: number | string;
  productId?: number | string;
}> = ({ title = _STRINGS.ASK_QUESTION_TITLE, defaultCount = 3, contentId, containerClass, productId }) => {
  const [meta, setMeta] = useState<Meta>({ currentPage: 1, lastPage: 1 });
  const [showMore, setShowMore] = useState(false);
  const [data, setData] = useState<QuestionDto[]>([]);
  const { isLoading } = useQuery({
    queryKey: [HomeService.CONTENT_QUESTIONS_KEY, meta?.currentPage],
    staleTime: 0,
    queryFn: () =>
      HomeService.FindAllComments(
        {
          content_id: !!contentId ? Number(contentId) : undefined,
          page: meta?.currentPage || 1,
          per_page: 10,
          product_id: !!productId ? Number(productId) : undefined,
        },
        (data) => {
          if (!!data?.meta) {
            setMeta(data?.meta);
            setData(data?.data);
          }
        }
      ),
  });
  const _onClickNext = () => {
    setMeta((meta) => ({ ...meta, currentPage: (meta?.currentPage || 1) + 1 }));
  };
  const _onClickPrev = () => {
    setMeta((meta) => ({ ...meta, currentPage: (meta?.currentPage || 1) - 1 }));
  };
  const _onClickPage = (page: number | string) => {
    setMeta({ ...meta, currentPage: Number(page) });
  };
  const _onShowMore = () => setShowMore(true);
  return (
    <div
      className={`flex w-full  bg-white rounded-10 md:rounded-20  flex-col items-center md:items-start justify-center p-5 ${containerClass}`}
    >
      {/* <p className="text-lg text-primary-700 font-normal mb-4">{title}</p> */}
      {data?.length > 0 && (
        <div className="w-full my-4 flex items-center justify-between">
          <p className=" !font-bold ">{title}</p>
          {!!meta?.total && meta?.total > 0 && (
            <p className="  text-primary-700 text-base font-bold ">
              {meta?.total} {!!contentId ? "نظر" : "پرسش"}
            </p>
          )}
        </div>
      )}
      {isLoading ? (
        <BtnLoading />
      ) : data?.length == 0 ? null : (
        <div className="flex w-full flex-col gap-4">
          {(showMore ? data : data?.filter((i, index) => index < defaultCount))?.map((item) => (
            <CommentComponent item={item} key={item?.id + "Quesrtion"} />
          ))}
        </div>
      )}
      <div className="self-center">
        {showMore ? (
          <Pagination
            currentPage={meta?.currentPage || 1}
            pageSize={10}
            totalCount={meta?.total || 0}
            onClickNext={_onClickNext}
            onPageChange={_onClickPage}
            onClickPrev={_onClickPrev}
          />
        ) : !!meta?.total && meta?.total > defaultCount ? (
          <Button variant="outline" onClick={_onShowMore} title={"مشاهده همه‌ی نظرات"} />
        ) : null}
      </div>
      <QuestionForm productId={productId} contentId={contentId} />
    </div>
  );
};
