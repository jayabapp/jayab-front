const DaysOfTheWeel = () => {
  return (
    <div className="w-full gap-1 border-b border-neutral-200/70 pb-2 items-center grid grid-cols-7">
      <p className="md:text-base text-sm truncate text-center  ">
        {/* شنبه */}ش
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* یکشنبه */}ی
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* دوشنبه */}د
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* سه شنبه */}س
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* چهارشنبه */}چ
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* پنجشنبه */}پ{" "}
      </p>
      <p className="md:text-base text-sm truncate text-center  ">
        {/* جمعه */}ج{" "}
      </p>
    </div>
  );
};

export default DaysOfTheWeel;
