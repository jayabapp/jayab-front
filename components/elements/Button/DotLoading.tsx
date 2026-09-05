const DOTS = ["-0.3s", "-0.15s", "0s"];

const DotLoading = () => (
  <span aria-hidden="true" className="flex h-5 items-center gap-1.5">
    {DOTS.map((delay) => (
      <span
        key={delay}
        style={{ animationDelay: delay }}
        className="size-2 animate-bounce rounded-full bg-current motion-reduce:animate-pulse"
      />
    ))}
  </span>
);

export default DotLoading;
