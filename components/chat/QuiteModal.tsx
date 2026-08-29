import React from "react";
import Button from "@elements/Button";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";

type modlType = {
  show: boolean;
  title: string;
  setShow: (e: any) => void | null;
};

const QuiteModal = ({ show, setShow, title }: modlType) => {
  const onHide = () => {
    setShow((e: boolean) => !e);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex p-8 flex-col gap-8">
        <p>آیا می خواهید از گروه {title} خارج شوید؟</p>
        <div className="flex gap-8 items-center justify-between">
          <Button
            title={"_STRINGS?.S67"}
            // onClick={signIn}
            width="w-full "
            containerClass=" mx-auto  w-full"
            roundedClass={"rounded-lg"}
            variant="outline"
            color="danger"
            // titleClass={"!font-medium !text-lg"}
            // loading={submitLoading}
            //  disabled={disable}
          />
          <Button
            title={"_STRINGS?.S68"}
            onClick={onHide}
            width="w-full "
            containerClass=" mx-auto  w-full"
            roundedClass={"rounded-lg"}
            variant={"outline"}
            // titleClass={"!font-medium !text-lg"}
            // loading={submitLoading}
            //  disabled={disable}
          />
        </div>
      </div>
    </Modal>
  );
};

export default QuiteModal;
