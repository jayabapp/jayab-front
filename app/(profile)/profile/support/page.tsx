"use client";

import { useSupportTickets } from "@features/support/hooks/useSupportTickets";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

import SupportCardSkeleton from "@/components/support/SupportCardSkeleton";
import SupportListSkeleton from "@/components/support/SupportListSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import SupportCard from "@/components/support/SupportCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@/components/shared/Button/Button";

const Support = () => {
  const { isLogin } = useAuthStore();
  const router = useRouter();
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    tickets,
  } = useSupportTickets("TICKET", Boolean(isLogin));

  const goToLogin = () => router.push("/auth?redirect_url=/profile/support");

  return (
    <div
      id="homeParent"
      className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
    >
      {isLogin ? (
        <>
          {isPending ? (
            <SupportListSkeleton />
          ) : isError ? (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              دریافت فهرست تیکت‌ها با خطا مواجه شد.
            </div>
          ) : tickets.length === 0 ? (
            <EmptyList />
          ) : (
            <InfiniteScroll
              dataLength={tickets.length}
              hasMore={Boolean(hasNextPage)}
              next={() => void fetchNextPage()}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2"
              loader={isFetchingNextPage ? <SupportCardSkeleton /> : null}
            >
              {tickets.map((ticket) => (
                <SupportCard item={ticket} key={`${ticket.id}tickets`} />
              ))}
            </InfiniteScroll>
          )}
          <Button
            variant="outline"
            width="!font-bold !bg-white"
            title={_STRINGS.SEND_NEW_TICKET}
            onClick={() => router.push("/profile/support/new-ticket")}
            containerClass="flex items-center justify-center 2xl:justify-start"
          />
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-primary-700">{_STRINGS.HI}!</h2>
          <p className="text-sm">{_STRINGS.FOR_SUPPORT_LOGIN}</p>
          <Button
            width="w-full"
            onClick={goToLogin}
            containerClass="mt-8 w-full"
            title={_STRINGS.LOGIN_TO_UR_ACCOUNT}
          />
        </div>
      )}
    </div>
  );
};

export default Support;
