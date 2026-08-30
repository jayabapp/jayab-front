import type { OwnerConfirmPromptProps } from "@/types/components/modules/owner-property";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const OwnerVerifyPromptModal = ({
  show,
  onHide,
  onConfirm,
}: OwnerConfirmPromptProps) => (
  <Modal show={show} onHide={onHide}>
    <div className="bg-white p-4 rounded-20 gap-4 flex flex-col items-center justify-center">
      <ContentImage
        alt=""
        width={256}
        height={256}
        className="w-64 aspect-square h-64"
        src="/assets/icons/adds/verify_prop.svg"
      />
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <p className="text-sm text-center">{_STRINGS.VERIFY_PROP_MODAL_TEXT}</p>
      </div>
      <div className="w-full flex items-center justify-center gap-4">
        <Button
          width="w-full"
          containerClass="w-full"
          onClick={onConfirm}
          roundedClass="rounded-full"
          title={_STRINGS.VERIFY_PROP}
        />
      </div>
    </div>
  </Modal>
);

export default OwnerVerifyPromptModal;
