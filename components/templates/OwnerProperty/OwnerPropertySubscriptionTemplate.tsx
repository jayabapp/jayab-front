import type { OwnerPropertyTemplateProps } from "@/types/components/templates/owner-property";

const OwnerPropertySubscriptionTemplate = ({
  children,
}: OwnerPropertyTemplateProps) => (
  <main className="profile-container flex flex-col gap-6">{children}</main>
);

export default OwnerPropertySubscriptionTemplate;
