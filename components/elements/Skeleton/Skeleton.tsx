import type { HTMLAttributes } from "react";

const Skeleton = ({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden="true"
    className={`animate-pulse bg-surface-muted motion-reduce:animate-none ${className}`}
    {...props}
  />
);

export default Skeleton;
