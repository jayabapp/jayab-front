import { useState } from "react";

import { NEW_IMAGE_URL } from "@/utils/urls";
import ProgressBar from "../shared/progressbar";

const UploadedItemShowCase = ({
  containerClass,
  innerClasses,
  item,
  onDelete,
  cb,
  progress,
}: {
  item: any;
  containerClass?: string;
  innerClasses?: { sizeClass?: string; secontParentClass?: string };
  onDelete?: () => void | null;
  cb?: () => void | null;
  progress: number; // 0–1 range
}) => {
  const [showRealData, setShowRealData] = useState(false);
  const [isError, setIsError] = useState(false);

  const isUploading = !showRealData || isError;
  const percent = Math.round((Number(progress) || 0) * 100);
  const sizeClass = innerClasses?.sizeClass || "h-24 w-24";

  return (
    <div className={`flex w-fit relative ${containerClass}`} style={{ zIndex: 4 }}>
      {isUploading && (
        <div className="rounded-20 absolute left-0 top-0 w-full h-full flex items-center justify-center bg-black/40 z-1 px-4">
          <ProgressBar progress={percent} />
        </div>
      )}

      <div className={`flex w-fit flex-col items-center justify-start rounded-20 ${innerClasses?.secontParentClass}`}>
        <div className={`${sizeClass} rounded-20 overflow-hidden flex flex-col items-center relative`}>
          <div
            onClick={cb}
            className={`cursor-pointer border bg-whiteGray-100 dark:bg-zinc-700 rounded-20 aspect-square relative ${sizeClass}`}
          >
            {isError ? null : item?.data ? (
              <img
                onLoad={() => setShowRealData(true)}
                onError={() => {
                  setShowRealData(true);
                  setIsError(true);
                }}
                alt="img"
                src={NEW_IMAGE_URL(item?.data)}
                className={`object-cover w-full bg-gradient-to-b rounded-20 aspect-square max-w-max ${sizeClass}`}
              />
            ) : null}

            {item?.url && (
              <img
                alt="img"
                src={item?.url}
                className={`object-cover ${
                  showRealData ? "opacity-0" : "opacity-100"
                } absolute inset-0 m-auto w-full bg-gradient-to-b rounded-20 aspect-square max-w-max ${sizeClass}`}
              />
            )}
          </div>

          {onDelete && item?.data && (
            <div
              className="bg-transparent cursor-pointer absolute top-2 left-2 shadow-2xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
            >
              <img src="/assets/icons/uploader/faded_x_circle.svg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedItemShowCase;
