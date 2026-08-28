const ChatRoomSkeleton = () => (
  <div className="flex h-[100dvh] w-full animate-pulse flex-col bg-neutral-100 motion-reduce:animate-none md:w-1/2 dark:bg-zinc-800">
    <div className="flex h-20 items-center gap-3 bg-white px-4 shadow-sm">
      <div className="size-12 rounded-full bg-neutral-200" />
      <div className="h-4 w-1/3 rounded bg-neutral-200" />
    </div>
    <div className="flex flex-1 flex-col justify-end gap-5 p-4">
      <div className="h-16 w-2/3 rounded-xl rounded-br-none bg-neutral-200" />
      <div className="mr-auto h-24 w-3/5 rounded-xl rounded-bl-none bg-white" />
      <div className="h-12 w-1/2 rounded-xl rounded-br-none bg-neutral-200" />
    </div>
    <div className="m-2 h-14 rounded-xl bg-white" />
  </div>
);

export default ChatRoomSkeleton;
