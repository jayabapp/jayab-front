type MoreClassType = { moreClass?: string };

export const Divider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t border-primary-200 dark:border-zinc-700 ${moreClass}`} />;
};
export const DivDivider = ({ moreClass }: MoreClassType) => {
  return <div className={` ${moreClass}`} />;
};
export const ShadowDivider = ({ moreClass }: MoreClassType) => {
  return <hr className={`border-t shadow dark:shadow-slate-600 border-gray-300 dark:border-gray-700 ${moreClass}`} />;
};
export const RedDivider = ({ moreClass }: MoreClassType) => {
  return (
    <hr className={`border-t w-20 border-red-600 dark:border-red-600 my-5 h-1 bg-rose-600 rounded ${moreClass}`} />
  );
};
export const PrimaryDivider = ({ moreClass }: MoreClassType) => {
  return (
    <hr
      className={`border-t w-40 border-primary-700 dark:border-primary-700 my-3 h-1 bg-primary-700 rounded ${moreClass}`}
    />
  );
};

export const LineTextStart = ({ moreClass, title }: { moreClass: string; title: string }) => {
  return (
    <div className={`flex items-center justify-start ${moreClass}  w-full relative`}>
      <p className="text-sm bg-white   dark:bg-zinc-800  dark:bg-transparent text-dark-200  pl-4 z-1">{title}</p>
      <hr className="w-full h-1 top-1/2 opacity-80 absolute"></hr>
    </div>
  );
};
