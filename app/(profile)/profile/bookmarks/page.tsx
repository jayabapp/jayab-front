import { BookmarkList } from "@modules/Bookmarks";

import ProfilePageTemplate from "@templates/ProfilePage";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const BookmarksPage = () => (
  <IntlNamespaces namespaces={["content", "profile"]}>
    <ProfilePageTemplate>
      <BookmarkList />
    </ProfilePageTemplate>
  </IntlNamespaces>
);

export default BookmarksPage;
