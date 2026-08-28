import { colors } from "@/theme/colors";
const HomeSkeleton = () => {
  return (
    <div
      style={{ backgroundColor: colors.neutral[200] }}
      className="flex aspect-[2] md:aspect-[2.5] w-full md:w-[40%] rounded-20 animate-pulse items-center group transition-all duration-200 motion-reduce:animate-none"
    ></div>
  );
};

export default HomeSkeleton;
