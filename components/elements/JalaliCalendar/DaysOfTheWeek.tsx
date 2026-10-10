import { useTranslations } from "next-intl";

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

const DaysOfTheWeel = () => {
  const t = useTranslations("calendar");

  return (
    <div className="w-full gap-1 items-center grid grid-cols-7">
      {WEEKDAYS.map((day) => (
        <p
          key={day}
          className="md:text-base text-sm truncate text-center font-bold "
        >
          {t(`short${day}`)}
        </p>
      ))}
    </div>
  );
};

export default DaysOfTheWeel;
