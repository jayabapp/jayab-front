type MoreClassType = { moreClass?: string };

export const Divider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t border-neutral-200   ${moreClass}`} />;
};
export const DivDivider = ({ moreClass }: MoreClassType) => {
  return <div className={` ${moreClass}`} />;
};
export const ShadowDivider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t shadow  border-neutral-300  ${moreClass}`} />;
};
export const RedDivider = ({ moreClass }: MoreClassType) => {
  return (
    <hr className={`border-t w-20 border-red-600  my-5 h-1 bg-rose-600 rounded ${moreClass}`} />
  );
};
export const PrimaryDivider = ({ moreClass }: MoreClassType) => {
  return (
    <hr
      className={`border-t w-40 border-brand-600  my-3 h-1 bg-brand-600 rounded ${moreClass}`}
    />
  );
};

export const LineTextStart = ({ moreClass, title }: { moreClass: string; title: string }) => {
  return (
    <div className={`flex items-center justify-start ${moreClass}  w-full relative`}>
      <p className="text-sm bg-white      text-dark-200  pl-4 z-1">{title}</p>
      <hr className="w-full h-1 top-1/2 opacity-80 absolute"></hr>
    </div>
  );
};
