import type { ProfilePageTemplateProps } from "@/types/components/templates/profile";

/**
 * The shell shared by the profile sub-pages. `containerClass` only carries the
 * per-page spacing the designs ask for; the column layout itself comes from the
 * profile layout above it.
 */
const ProfilePageTemplate = ({
  children,
  containerClass,
}: ProfilePageTemplateProps) => (
  <main
    id="homeParent"
    className={`profile-container transition-all duration-500 ease-in-out ${containerClass ?? ""}`}
  >
    {children}
  </main>
);

export default ProfilePageTemplate;
