import { ContentImage } from "@/components/elements/Image";
import { Icon } from "@elements/Icon";

import type { FullscreenImageProps } from "@/types/components/elements/upload";

import Modal from "@elements/Modal";

const FullscreenImage = ({
  src,
  show,
  isNew,
  setShow,
  onDelete,
}: FullscreenImageProps) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <div className="h-full w-full flex flex-col p-2 gap-2 justify-center items-center bg-surface">
        <div className="w-full h-8 flex items-center justify-between">
          <button
            type="button"
            aria-label="close"
            onClick={() => setShow(false)}
            className="m-2 cursor-pointer"
          >
            <Icon name="x" size={20} />
          </button>

          {onDelete ? (
            <div className="me-2">
              <ContentImage
                alt=""
                height={16}
                width={16}
                onClick={() => onDelete()}
                className="w-4 h-auto cursor-pointer"
                src="/assets/icons/uploader/TrashIcon.svg"
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
          className="object-cover w-full bg-gradient-to-b aspect-auto max-w-max rounded-xl"
        />
      </div>
    </Modal>
  );
};

export default FullscreenImage;
