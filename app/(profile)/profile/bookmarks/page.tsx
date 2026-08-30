import ProfilePageTemplate from "@templates/ProfilePage";
import { BookmarkList } from "@modules/Bookmarks";

const BookmarksPage = () => (
  <ProfilePageTemplate>
    <BookmarkList />
  </ProfilePageTemplate>
);

export default BookmarksPage;
