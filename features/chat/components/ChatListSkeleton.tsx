const ChatListSkeleton = () => (
  <div
    className="flex w-full flex-col gap-4"
    aria-label="در حال دریافت گفتگوها"
  >
    {Array.from({ length: 6 }).map((_, index) => (
      <div className="flex animate-pulse gap-3 border-b pb-4" key={index}>
        <div className="size-12 shrink-0 rounded-md bg-neutral-200" />
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-4 w-2/5 rounded bg-neutral-200" />
          <div className="h-3 w-3/5 rounded bg-neutral-200" />
          <div className="h-3 w-full rounded bg-neutral-100" />
        </div>
      </div>
    ))}
  </div>
);

export default ChatListSkeleton;
