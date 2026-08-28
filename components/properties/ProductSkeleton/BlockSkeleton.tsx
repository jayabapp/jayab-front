import { colors } from "@/theme/colors";
const BlockSkeleton = ({ width }: { width: number | string }) => {
  return (
    <div
      style={{ backgroundColor: colors.neutral[200], width: width }}
      className="flex aspect-square rounded-20 animate-pulse items-center w-full group transition-all duration-200 motion-reduce:animate-none"
    ></div>
  );
};

export default BlockSkeleton;
