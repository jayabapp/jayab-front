import type { CityCardProps } from "@/types/components/modules/city-selector";

const CityCard = ({ callback, isChecked, item }: CityCardProps) => (
  <button
    aria-checked={isChecked}
    className="flex w-full cursor-pointer flex-row items-center justify-between gap-2 border-b py-1 transition-all"
    onClick={callback}
    role="checkbox"
    type="button"
  >
    <span className="text-sm font-medium md:text-base">{item?.title}</span>
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
        isChecked ? "border-transparent bg-action" : "border-line-strong"
      }`}
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="10"
        viewBox="0 0 12 10"
        width="12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="white" />
      </svg>
    </span>
  </button>
);

export default CityCard;
