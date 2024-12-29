import React from "react";

// const DaysOfTheWeel = () => {
//   return (
//     <div className="w-full gap-4 items-center grid grid-cols-7">
//       <p className="text-[0.5rem] md:text-xs text-center opacity-60">شنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">یکشنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">دوشنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">سه شنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">چهارشنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">پنجشنبه</p>
//       <p className="md:text-xs text-[0.5rem] truncate text-center opacity-60">جمعه</p>
//     </div>
//   );
// };

// export default DaysOfTheWeel;

import moment from "moment-jalaali";
export const DaysOfWeek = () => {
  moment.locale("ar");
  return (
    <div className="w-full gap-4 items-center grid grid-cols-7">
      {moment.weekdays(true)?.map((e, i) => (
        <p key={`${e}${i}`} className="md:text-xs text-[0.5rem] truncate text-center opacity-60">
          {e}
        </p>
      ))}
    </div>
  );
};
export default DaysOfWeek;
