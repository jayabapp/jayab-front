export const LinearData = ({
  title,
  value,
  textClassName,
  titleClassName,
  containerClassName,
  disableDash,
}: {
  title: string;
  value: string;
  textClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
  disableDash?: boolean;
}) => {
  return (
    <div className={`w-full flex gap-4 items-center justify-between ${containerClassName}`}>
      <p className={` !whitespace-nowrap text-sm md:text-base ${titleClassName}`}>{title}</p>
      {!!disableDash ? <></> : <div className="w-full h-1 border-b border-dashed"></div>}
      <p className={` !whitespace-nowrap text-sm md:text-base  ${textClassName}`}>{value}</p>
    </div>
  );
};

export default LinearData;
