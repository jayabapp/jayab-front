const LinearTextBlock = ({
  title,
  value,
  unit,
  options,
}: {
  title: string;
  value: string | number;
  unit?: string | number;
  options?: { title_class?: string; value_class?: string };
}) => {
  return (
    <div className="flex items-center justify-between w-full ">
      <p className={`text-sm font-light  ${options?.title_class}`}>{title}</p>

      <p className={`font-semibold ${options?.value_class}`}>
        {value} <span className="font-light">{unit}</span>
      </p>
    </div>
  );
};

export default LinearTextBlock;
