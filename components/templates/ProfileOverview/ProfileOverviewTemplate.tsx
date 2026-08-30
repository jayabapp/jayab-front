import type { ProfileTemplateProps } from "@/types/components/templates/profile";

const ProfileOverviewTemplate = ({ children }: ProfileTemplateProps) => (
  <main
    id="homeParent"
    className="profile-container flex flex-col gap-4 transition-all duration-500 ease-in-out"
  >
    {children}
  </main>
);

export default ProfileOverviewTemplate;
