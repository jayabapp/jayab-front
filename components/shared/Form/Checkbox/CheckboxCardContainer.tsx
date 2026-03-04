import { ReactNode } from "react";
import Checkbox from ".";

const CheckboxCardContainer = ({
  isChecked,
  onSelect,
  title,
  description,
  children,
  item,
}: {
  isChecked: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  onSelect: () => void;
  item?: {
    disabled?: boolean;
    hint?: string;
  };
}) => {
  return (
    <div
      className={`w-full flex flex-col gap-2 rounded-10 border py-2 px-2.5 relative overflow-clip ${
        item?.disabled ? "bg-neutral-50 grayscale" : ""
      } `}
    >
      <Checkbox
        isChecked={isChecked}
        onSelect={item?.disabled ? () => {} : onSelect}
        title={title}
      />
      {!!item?.hint && (
        <p className="-mt-2 leading-3 text-xs opacity-75 font-regular text-neutral-500 ">
          {item?.hint}
        </p>
      )}

      <p className="text-xs md:text-sm font-thin text-justify !leading-relaxed">
        {description}
      </p>
      <span> {children}</span>
    </div>
  );
};

export default CheckboxCardContainer;
