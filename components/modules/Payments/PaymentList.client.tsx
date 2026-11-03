"use client";

import { useUserSubscriptions } from "@features/user/hooks/useUserSubscriptions";
import { useTranslations } from "next-intl";

import PaymentDateFilter from "./parts/PaymentDateFilter.client";
import InfiniteScroll from "react-infinite-scroll-component";
import PaymentCard from "./parts/PaymentCard";
import EmptyState from "@elements/EmptyState";
import useQueryGet from "@/helpers/queryGet";
import moment from "moment-jalaali";

const JALALI_QUERY_DATE = "jYYYY/jMM/jDD";
const SKELETON_COUNT = 4;

const PaymentSkeleton = () => (
  <div className="h-32 animate-pulse rounded-20 bg-surface-hover" />
);

const PaymentList = () => {
  const t = useTranslations();

  const query = useQueryGet<Record<string, string>>();
  const {
    subscriptions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useUserSubscriptions({
    from: query?.from
      ? moment(query.from, JALALI_QUERY_DATE).toDate()
      : undefined,
    to: query?.to ? moment(query.to, JALALI_QUERY_DATE).toDate() : undefined,
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full flex flex-col gap-2">
        <p className="font-light w-full text-start text-sm">
          {t("profile.selectTimeWindow")}
        </p>
        <div className="flex items-center gap-4">
          <div className="w-full flex items-start md:items-center flex-col md:flex-row gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex w-fit shrink-0 items-center gap-2">
                <p>{t("common.from")}</p>
                <PaymentDateFilter query={query} queryKey="from" />
              </div>
              <div className="flex w-fit shrink-0 items-center justify-end gap-2">
                <p>{t("common.to")}</p>
                <PaymentDateFilter query={query} queryKey="to" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" role="status">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <PaymentSkeleton key={index} />
          ))}
        </div>
      ) : subscriptions.length > 0 ? (
        <InfiniteScroll
          hasMore={Boolean(hasNextPage)}
          dataLength={subscriptions.length}
          next={() => void fetchNextPage()}
          loader={isFetchingNextPage ? <PaymentSkeleton /> : null}
          className="grid px-1 pb-8 pt-4 !overflow-hidden grid-cols-1 gap-2 md:gap-4 lg:grid-cols-2 2xl:grid-cols-2"
        >
          {subscriptions.map((payment) => (
            <PaymentCard payment={payment} key={`payment${payment?.id}`} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="col-span-4">
          <EmptyState
            title={t("profile.emptyPaymentsTitle")}
            description={t("profile.emptyPaymentsDesc")}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentList;
