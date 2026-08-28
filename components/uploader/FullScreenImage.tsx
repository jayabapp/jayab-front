import { ContentImage } from "@/components/elements/Image";

import Modal from "../Modal";

type TFullScreenProps = {
  src: any;
  show: boolean;
  isNew?: boolean;
  onDelete?: () => void | null;
  setShow: (e: boolean | string | any) => void | null;
};

const FullscreenImage = ({
  src,
  show,
  isNew,
  setShow,
  onDelete,
}: TFullScreenProps) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className="h-full w-full flex flex-col p-2 gap-2  justify-center items-center bg-white   ">
        <div className="w-full h-8 flex items-center justify-between">
          <img
            src="/assets/icons/adds/x_mark.svg"
            onClick={() => setShow(false)}
            className="cursor-pointer w-4 m-2  "
          />

          {onDelete ? (
            <div className="ml-2">
              <img
                src="/assets/icons/uploader/TrashIcon.svg"
                className="w-4 h-auto cursor-pointer"
                onClick={() => onDelete()}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <ContentImage
          alt="img"
          src={src}
          width={1024}
          height={1024}
          sizes="100vw"
          unoptimized={isNew}
          className="object-cover  w-full bg-gradient-to-b aspect-auto max-w-max  rounded-xl"
        />
      </div>
    </Modal>
  );
};

export default FullscreenImage;
