"use client";

import { useSupportTickets } from "@features/support/hooks/useSupportTickets";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

import SupportCardSkeleton from "./parts/SupportCardSkeleton";
import SupportListSkeleton from "./parts/SupportListSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import SupportCard from "./parts/SupportCard";
import EmptyState from "@elements/EmptyState";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const SupportList = () => {
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
    <div className="flex flex-col gap-4">
      {isLogin ? (
        <>
          {isPending ? (
            <SupportListSkeleton />
          ) : isError ? (
            <div
              role="alert"
              className="rounded-lg bg-danger-50 p-4 text-sm text-danger-500"
            >
              {_STRINGS.SUPPORT_LIST_ERROR}
            </div>
          ) : tickets.length === 0 ? (
            <EmptyState
              title={_STRINGS.EMPTY_SUPPORT_TITLE}
              actionRoute="/profile/support/new-ticket"
              description={_STRINGS.EMPTY_SUPPORT_DESC}
              actionLabel={_STRINGS.SEND_NEW_TICKET}
            />
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
          <h2 className="text-brand-600">{_STRINGS.HI}!</h2>
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

export default SupportList;
