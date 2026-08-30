import type { ProfileTemplateProps } from "@/types/components/templates/profile";

const NotificationsTemplate = ({ children }: ProfileTemplateProps) => (
  <main
    id="homeParent"
    className="container transition-all duration-500 ease-in-out"
  >
    {children}
  </main>
);

export default NotificationsTemplate;
