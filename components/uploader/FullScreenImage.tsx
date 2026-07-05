import { useEffect, useState } from "react";
import Modal from "../Modal";

function FullscreenImage({
  show,
  setShow,
  src,
  onDelete,
  isNew,
}: {
  show: boolean;
  setShow: (e: boolean | string | any) => void | null;
  src: any;
  onDelete?: () => void | null;
  isNew?: boolean;
}) {
  const [srcHelper, setSrcHelper] = useState("");

  useEffect(() => {
    if (src) {
      setSrcHelper(src);
    }
  }, [src]);
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className="h-full w-full flex flex-col p-2 gap-2  justify-center items-center bg-white  dark:bg-dark-700 ">
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
        <img
          alt="img"
          src={
            isNew
              ? srcHelper
              : //  NEW_IMAGE_URL(srcHelper)
                srcHelper
          }
          className="object-cover  w-full bg-gradient-to-b aspect-auto max-w-max  rounded-xl"
        />
      </div>
    </Modal>
  );
}

export default FullscreenImage;
