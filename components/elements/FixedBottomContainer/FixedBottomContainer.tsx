const FixedBottomContainer = ({
  children,
  containerClass,
}: {
  children: any;
  containerClass?: string;
}) => {
  return (
    <div
      className={`z-[11]  flex   max-w-[800px]  pb-8  pt-3 md:py-3   justify-between  md:rounded-md  end-0  start-0     mx-auto   shadow-surface transition-all duration-1000	ease-in-out  items-center fixed bottom-0 w-full   bg-surface      ${containerClass}`}
    >
      {children}
    </div>
  );
};

export default FixedBottomContainer;
