const DaysOfTheWeel = () => {
  return (
    <div className="w-full gap-4 items-center grid grid-cols-7">
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* شنبه */}ش
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* یکشنبه */}ی
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* دوشنبه */}د
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* سه شنبه */}س
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* چهارشنبه */}چ
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* پنجشنبه */}پ{" "}
      </p>
      <p className="md:text-base text-sm truncate text-center font-bold ">
        {/* جمعه */}ج{" "}
      </p>
    </div>
  );
};

export default DaysOfTheWeel;
