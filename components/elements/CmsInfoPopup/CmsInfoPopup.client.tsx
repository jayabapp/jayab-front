"use client";

import type { CmsInfoPopupProps } from "@/types/components/elements/cms";
import { ContentImage } from "@/components/elements/Image";
import { ModalBottomSheet } from "@elements/Modal";
import { NEW_IMAGE_URL } from "@/utils/urls";

import CmsContentSkeleton from "@elements/Skeleton/CmsContentSkeleton";
import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@elements/CmsText";
import Button from "@elements/Button";
import Link from "next/link";

const CmsInfoPopup = ({ show, onHide, action, contentKey }: CmsInfoPopupProps) => {
  const { content, isLoading } = useCmsContent(contentKey, { enabled: !!show });

  const actionButton = (
    <Button
      width="w-full"
      variant="outline"
      title={action?.title}
      containerClass="w-full"
      onClick={action?.href ? undefined : action?.onClick}
    />
  );

  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <div className="flex gap-4  items-center justify-center flex-col p-4  ">
        {isLoading ? (
          <CmsContentSkeleton />
        ) : (
          <>
            <ContentImage
              width={512}
              height={512}
              sizes="240px"
              className="w-60 h-auto"
              alt={content?.title || ""}
              src={NEW_IMAGE_URL(content?.feature_image)}
            />

            <div className="flex flex-col w-full gap-2 items-center justify-center">
              <CmsText className=" font-medium">{content?.small_text}</CmsText>
              <CmsText className="  opacity-65  text-sm text-center  ">
                {content?.full_text}
              </CmsText>
            </div>

            {action?.href ? (
              <Link
                prefetch={false}
                href={action?.href}
                className=" w-full"
                title={action?.title}
              >
                {actionButton}
              </Link>
            ) : (
              actionButton
            )}
          </>
        )}
      </div>
    </ModalBottomSheet>
  );
};

export default CmsInfoPopup;
