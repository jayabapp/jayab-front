"use client";

import { useUserSubscriptions } from "@features/notifications/hooks/useUserSubscriptions";

import DatePickerQueryWithDynamicKeyFilter from "@/components/widgets/DatePicker/DatePickerQueryWithDynamicKeyFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import MyPaymentCards from "@/components/profile/MyPaymentCards";
import useQueryGet from "@/helpers/queryGet";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const Income = () => {
  const queriesParams = useQueryGet<any>();
  const {
    subscriptions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useUserSubscriptions({
    from: queriesParams?.from
      ? moment(queriesParams.from, "jYYYY/jMM/jDD").toDate()
      : undefined,
    to: queriesParams?.to
      ? moment(queriesParams.to, "jYYYY/jMM/jDD").toDate()
      : undefined,
  });

  return (
    <div
      id="homeParent"
      className=" profile-container  !pb-36 items-center   !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-1 "
    >
      <div className="flex flex-col  gap-4 w-full  ">
        <div className="w-full flex flex-col gap-2">
          <p className="font-light  w-full text-start text-sm">
            {_STRINGS.SELECT_TIME_WINDOW}
          </p>
          <div className="flex items-center gap-4">
            <div className=" w-full flex items-start md:items-center  flex-col md:flex-row  gap-4 justify-between">
              <div className=" flex items-center  gap-4">
                <div className="flex w-fit shrink-0 items-center gap-2   ">
                  {" "}
                  <p>{_STRINGS.FROM}</p>{" "}
                  <DatePickerQueryWithDynamicKeyFilter
                    queryKey={"from"}
                    query={queriesParams}
                  />
                </div>
                <div className="flex w-fit shrink-0 items-center justify-end gap-2   ">
                  {" "}
                  <p>{_STRINGS.TO}</p>{" "}
                  <DatePickerQueryWithDynamicKeyFilter
                    queryKey={"to"}
                    query={queriesParams}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" role="status">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-20 bg-neutral-200" />
            ))}
          </div>
        ) : subscriptions.length > 0 ? (
          <InfiniteScroll
            dataLength={subscriptions.length}
            next={() => void fetchNextPage()}
            hasMore={Boolean(hasNextPage)}
            loader={
              isFetchingNextPage ? (
                <div className="h-32 animate-pulse rounded-20 bg-neutral-200" />
              ) : null
            }
            className="grid px-1   pb-8 pt-4 !overflow-hidden  grid-cols-1 gap-2 md:gap-4  lg:grid-cols-2 2xl:grid-cols-2 "
          >
            {subscriptions.map((i) => (
              <MyPaymentCards data={i} key={`payment${i?.id}`} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Income;
