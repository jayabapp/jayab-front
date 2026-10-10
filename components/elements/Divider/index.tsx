import type { DividerProps, LineTextStartProps } from "@/types/components/elements/divider";

export const Divider = ({ moreClass }: DividerProps) => {
  return <hr className={`border-t border-line   ${moreClass}`} />;
};
export const DivDivider = ({ moreClass }: DividerProps) => {
  return <div className={` ${moreClass}`} />;
};
export const ShadowDivider = ({ moreClass }: DividerProps) => {
  return <hr className={`border-t shadow  border-line-strong  ${moreClass}`} />;
};
export const RedDivider = ({ moreClass }: DividerProps) => {
  return (
    <hr className={`border-t w-20 border-status-danger  my-5 h-1 bg-rose-600 rounded ${moreClass}`} />
  );
};
export const PrimaryDivider = ({ moreClass }: DividerProps) => {
  return (
    <hr
      className={`border-t w-40 border-action  my-3 h-1 bg-action rounded ${moreClass}`}
    />
  );
};

export const LineTextStart = ({ moreClass, title }: LineTextStartProps) => {
  return (
    <div className={`flex items-center justify-start ${moreClass}  w-full relative`}>
      <p className="text-sm bg-surface      text-dark-200  pl-4 z-1">{title}</p>
      <hr className="w-full h-1 top-1/2 opacity-80 absolute"></hr>
    </div>
  );
};
