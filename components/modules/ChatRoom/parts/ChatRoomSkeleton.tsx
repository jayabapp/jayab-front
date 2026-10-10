const ChatRoomSkeleton = () => (
  <div className="flex h-[100dvh] w-full animate-pulse flex-col bg-surface-muted motion-reduce:animate-none md:w-1/2 ">
    <div className="bg-surface shadow-sm">
      <div className="flex h-20 items-center gap-3 px-4">
        <div className="size-12 rounded-full bg-surface-hover" />
        <div className="h-4 w-1/3 rounded bg-surface-hover" />
      </div>
      <div className="h-20 border-t border-status-warning-line bg-status-warning-bg" />
    </div>
    <div className="flex flex-1 flex-col justify-end gap-5 p-4">
      <div className="h-16 w-2/3 rounded-xl rounded-br-none bg-surface-hover" />
      <div className="mr-auto h-24 w-3/5 rounded-xl rounded-bl-none bg-surface" />
      <div className="h-12 w-1/2 rounded-xl rounded-br-none bg-surface-hover" />
    </div>
    <div className="m-2 h-14 rounded-xl bg-surface" />
  </div>
);

export default ChatRoomSkeleton;
