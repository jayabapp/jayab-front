type NotifyArgs = Parameters<(typeof import("./index"))["default"]>[0];

export const notify = async (args: NotifyArgs) => {
  const { default: Notify } = await import("./index");
  Notify(args);
};

export default notify;
