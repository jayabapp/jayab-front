import type { NotifyProps } from "@/types/components/elements/toast";

export const notify = async (args: NotifyProps) => {
  const { default: Notify } = await import("./index");
  Notify(args);
};

export default notify;
