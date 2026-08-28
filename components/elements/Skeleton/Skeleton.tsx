import type { HTMLAttributes } from "react";

const Skeleton = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden="true"
    className={`animate-pulse bg-neutral-200 motion-reduce:animate-none dark:bg-zinc-700 ${className}`}
    {...props}
  />
);

export default Skeleton;
