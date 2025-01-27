"use client";

import { useQuery } from "@tanstack/react-query";
import { isEmpty, last } from "lodash";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import _STRINGS from "../../utils/LocalStrings";
import { useStoreSocket } from "@/store";
import { UserService } from "@/api_services/user/user.service";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import NotifCard from "@/components/notification/NotifCard";

const Notifications = () => {
  const [cursor, setCursor] = useState(0);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [refresher, setRefresher] = useState(false);
  const { notification } = useStoreSocket((state) => state);

  useEffect(() => {
    if (!!notification) {
      setRefresher((e) => !e);
      setCursor(0);
    }
  }, [notification]);
  const { data: solidData, isLoading } = useQuery({
    queryKey: [UserService?.NOTIFS_CACHEKEY, cursor, refresher],
    queryFn: () => UserService?.userNotifs({ cursor }),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (solidData?.data)
      if (cursor == 0) {
        setNotifs((x) => solidData?.data);
      } else {
        setNotifs((x) => [...x, ...solidData?.data]);
      }
  }, [solidData]);

  return (
    <div id="homeParent" className="  container   transition-all duration-500 ease-in-out ">
      {!!isLoading && isEmpty(notifs) ? (
        <LottieLoading />
      ) : (
        <InfiniteScroll
          dataLength={notifs?.length} //This is important field to render the next data
          next={() => {
            setCursor(last(notifs)?.id || 0);
          }}
          hasMore={!isEmpty(solidData?.data) ? true : false}
          className=" grid  grid-cols-1 md:grid-cols-2 gap-4 pb-4  md:p-4"
          loader={
            <div className="flex  col-span-2 flex-col gap-4 p-4">
              <BtnLoading />
            </div>
          }
        >
          {notifs?.length == 0 ? (
            <div className="col-span-2">
              {" "}
              <EmptyList />
            </div>
          ) : (
            notifs?.map((e) => <NotifCard item={e} key={`accouncments${e?.title}`} />)
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Notifications;
