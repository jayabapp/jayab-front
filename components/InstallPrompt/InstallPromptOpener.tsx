import React, { useState } from "react";
import { useStoreInit, useStoreParams } from "../../store";

const InstallPromptOpener = () => {
  return (
    <>
      <div
        onClick={() => {
          useStoreParams.setState({ showInstallPrompt: true });
        }}
      >
        <img src="/assets/icons/download_app.svg" className="aspect-square w-6 mb-2" />
      </div>
    </>
  );
};

export default InstallPromptOpener;
