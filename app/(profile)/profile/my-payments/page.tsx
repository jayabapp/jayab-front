"use client";

import { useEffect, useState } from "react";
import { UserService } from "@/api_services/user/user.service";
import { useQuery } from "@tanstack/react-query";

import DatePickerQueryWithDynamicKeyFilter from "@/components/widgets/DatePicker/DatePickerQueryWithDynamicKeyFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import MyPaymentCards from "@/components/profile/MyPaymentCards";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import useQueryGet from "@/helpers/queryGet";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";
import last from "lodash/last";

const Income = () => {
  const queriesParams = useQueryGet<any>();
  const [cursor, setCursor] = useState(0);
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const {
    data: solidData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      UserService.USER_SUBSCRIPTIONS_CACHEKEY,
      queriesParams?.from,
      queriesParams?.to,
    ],
    queryFn: () =>
      UserService.getUserSubscriptions({
        from: !!queriesParams?.from
          ? moment(queriesParams?.from, "jYYYY/jMM/jDD").toDate()
          : undefined,
        to: !!queriesParams?.to
          ? moment(queriesParams?.to, "jYYYY/jMM/jDD").toDate()
          : undefined,
        cursor: cursor,
      }),
    staleTime: 0,
    gcTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!solidData?.data) {
      if (Number(cursor) == 0 || cursor == 0) {
        setData(solidData?.data);
      } else setData((x) => [...x, ...solidData?.data]);
    }
  }, [solidData]);

  useEffect(() => {
    setData([]);
    setCursor(0);
    setRefetcherBoolean((e) => !e);
  }, [queriesParams?.from, queriesParams?.to]);

  useEffect(() => {
    refetch();
  }, [cursor, refetcherBoolean]);

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

        {isLoading && data?.length == 0 ? (
          <LottieLoading />
        ) : data && data?.length > 0 ? (
          <InfiniteScroll
            dataLength={data?.length}
            next={() => {
              setCursor(last(data)?.id || 0);
            }}
            hasMore={solidData?.data?.length != 0 ? true : false}
            loader={
              <div className="w-full mt-8 flex items-center justify-center">
                <BtnLoading />
              </div>
            }
            className="grid px-1   pb-8 pt-4 !overflow-hidden  grid-cols-1 gap-2 md:gap-4  lg:grid-cols-2 2xl:grid-cols-2 "
          >
            {data?.map((i) => (
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
