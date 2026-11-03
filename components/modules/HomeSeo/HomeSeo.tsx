import { OrganizationSchema } from "@features/seo/components/Schemas";
import { SearchboxSchema } from "@features/seo/components/Schemas";

const HomeSeo = () => (
  <>
    <SearchboxSchema />
    <OrganizationSchema />
  </>
);

export default HomeSeo;
