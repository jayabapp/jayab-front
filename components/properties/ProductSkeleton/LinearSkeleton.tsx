import { colors } from "@/theme/colors";
const LinearSkeleton = ({ width }: { width: number | string }) => {
  return (
    <div
      style={{ backgroundColor: colors.neutral[200], width: width }}
      className="flex h-8 rounded-full animate-pulse items-center p-2 w-full group transition-all duration-200 motion-reduce:animate-none"
    ></div>
  );
};

export default LinearSkeleton;
