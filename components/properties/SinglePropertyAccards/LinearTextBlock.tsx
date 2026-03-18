const LinearTextBlock = ({
  title,
  value,
  unit,
  options,
  dots,
}: {
  title: string;
  dots?: boolean;
  value: string | number;
  unit?: string | number;
  options?: { title_class?: string; value_class?: string };
}) => {
  return (
    <div className="flex items-center gap-4 justify-between w-full ">
      <p className={`text-sm font-light  ${options?.title_class} ${dots ? "shrink-0" : ""}`}>{title}</p>
      {!!dots ? <div className="w-full h-[1px] border-t border-dashed"> </div> : <></>}
      <p className={`font-semibold ${options?.value_class}  ${dots ? "shrink-0" : ""}`}>
        {value} <span className="font-light">{unit}</span>
      </p>
    </div>
  );
};

export default LinearTextBlock;
