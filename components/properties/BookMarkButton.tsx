import { useAuthStore, useStoreParams } from "@/store";
import { useTogglePropertyBookmark } from "@features/properties/hooks/useTogglePropertyBookmark";
import { SinglePropDto } from "@/api_services/property/property.interface";

const BookMarkButton = ({ data }: { data: SinglePropDto }) => {
  const { bookmarks } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const { mutate, isPending } = useTogglePropertyBookmark(data.id);

  const onSave = () => {
    if (!!isLogin) {
      mutate();
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  return (
    <img
      onClick={() => {
        if (!isPending) onSave();
      }}
      className=" w-5 cursor-pointer h-5 aspect-square"
      src={
        bookmarks?.includes(data?.id)
          ? "/assets/icons/adds/filled_bookmark.svg"
          : "/assets/icons/adds/empty_bookmark.svg"
      }
    />
  );
};

export default BookMarkButton;
