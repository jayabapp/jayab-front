import type { TStatusProps } from "@/types/components/elements/LinearData";

const StatusShower = ({ data, containerClass }: TStatusProps) => {
  return (
    <div
      className={` ${containerClass}   w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-xxs  md:text-sm font-medium`}
      style={{
        background: `${data?.hex}15`,
        color: `${data?.hex}`,
      }}
    >
      {data?.title}
    </div>
  );
};

export default StatusShower;
