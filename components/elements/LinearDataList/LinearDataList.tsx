import type { TLineardataProps } from "@/types/components/elements/LinearData";

export const LinearData = ({
  value,
  title,
  disableDash,
  textClassName,
  titleClassName,
  containerClassName,
}: TLineardataProps) => {
  return (
    <div
      className={`w-full flex gap-4 items-center justify-between ${containerClassName}`}
    >
      <p
        className={` !whitespace-nowrap text-sm md:text-base ${titleClassName}`}
      >
        {title}
      </p>
      {!!disableDash ? (
        <></>
      ) : (
        <div className="w-full h-1 border-b border-dashed"></div>
      )}
      <p
        className={` !whitespace-nowrap text-sm md:text-base  ${textClassName}`}
      >
        {value}
      </p>
    </div>
  );
};

export default LinearData;
