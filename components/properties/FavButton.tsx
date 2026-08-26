import { useAuthStore, useStoreParams } from "@/store";
import { useTogglePropertyLike } from "@features/properties/hooks/useTogglePropertyLike";
import { SinglePropDto } from "@/api_services/property/property.interface";

const FavButton = ({
  data,
  setFavCount,
}: {
  data: SinglePropDto;
  setFavCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { likes } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const like = likes.includes(data.id);
  const { mutate, isPending } = useTogglePropertyLike(data.id);

  const onLike = () => {
    if (!!isLogin) {
      const delta = like ? -1 : 1;
      setFavCount((count) => Math.max(0, count + delta));
      mutate(undefined, {
        onError: () => setFavCount((count) => Math.max(0, count - delta)),
      });
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  const onClick = () => {
    if (!!isLogin) {
      if (!isPending) onLike();
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  return (
    <img
      onClick={() => {
        onClick();
      }}
      className="  w-5 cursor-pointer h-5 aspect-square"
      src={
        like
          ? "/assets/icons/adds/filled_heart.svg"
          : "/assets/icons/adds/empty_heart.svg"
      }
    />
  );
};

export default FavButton;
