"use client";

import { ContentQuestionsSkeleton } from "./ContentQuestionsSkeleton";
import { useContentQuestions } from "@features/home/hooks/useContentQuestions";
import { CommentComponent } from "./CommentComponent.client";
import { useTranslations } from "next-intl";
import { QuestionForm } from "./QuestionForm.client";
import { useState } from "react";

import type { ContentQuestionsProps } from "@/types/components/modules/content-questions";

import Pagination from "@elements/Pagination";
import Button from "@elements/Button";

export const ContentQuestions = ({
  title,
  productId,
  contentId,
  containerClass,
  defaultCount = 3,
}: ContentQuestionsProps) => {
  const t = useTranslations();

  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const {
    isLoading,
    questions: data,
    meta,
  } = useContentQuestions({
    contentId: contentId ? Number(contentId) : undefined,
    page,
    perPage: 10,
    productId: productId ? Number(productId) : undefined,
  });
  const _onClickNext = () => setPage((current) => current + 1);
  const _onClickPrev = () => setPage((current) => Math.max(1, current - 1));
  const _onClickPage = (page: number | string) => setPage(Number(page));
  const _onShowMore = () => setShowMore(true);
  
  return (
    <div
      className={`flex w-full  bg-white rounded-10 md:rounded-20  flex-col items-center md:items-start justify-center p-5 ${containerClass}`}
    >
      {data?.length > 0 && (
        <div className="w-full my-4 flex items-center justify-between">
          <p className=" !font-bold ">
            {title ?? t("content.askQuestionTitle")}
          </p>
          {!!meta?.total && meta?.total > 0 && (
            <p className="  text-brand-600 text-base font-bold ">
              {meta?.total}{" "}
              {!!contentId ? t("content.comment") : t("content.question")}
            </p>
          )}
        </div>
      )}
      {isLoading ? (
        <ContentQuestionsSkeleton />
      ) : data?.length == 0 ? null : (
        <div className="flex w-full flex-col gap-4">
          {(showMore
            ? data
            : data?.filter((i, index) => index < defaultCount)
          )?.map((item) => (
            <CommentComponent item={item} key={item?.id + "Quesrtion"} />
          ))}
        </div>
      )}
      <div className="self-center">
        {showMore ? (
          <Pagination
            pageSize={10}
            onClickPrev={_onClickPrev}
            onClickNext={_onClickNext}
            onPageChange={_onClickPage}
            totalCount={meta?.total || 0}
            currentPage={meta?.currentPage || 1}
          />
        ) : !!meta?.total && meta?.total > defaultCount ? (
          <Button
            variant="outline"
            onClick={_onShowMore}
            title={t("content.seeAllComments")}
          />
        ) : null}
      </div>
      <QuestionForm productId={productId} contentId={contentId} />
    </div>
  );
};
