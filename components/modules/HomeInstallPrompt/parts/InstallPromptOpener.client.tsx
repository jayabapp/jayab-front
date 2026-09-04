import { useStoreParams } from "@/store";

import Image from "next/image";

const InstallPromptOpener = () => {
  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => {
          useStoreParams.setState({ showInstallPrompt: true });
        }}
      >
        <Image
          alt=""
          width={24}
          height={24}
          className="mb-2 aspect-square w-6"
          src="/assets/icons/download_app.svg"
        />
      </div>
    </>
  );
};

export default InstallPromptOpener;
