"use client";

import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";

import CmsContentSkeleton from "@/components/shared/CmsContentSkeleton";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import useCmsContent from "@/hooks/useCmsContent";
import CmsText from "@/components/shared/CmsText";
import Button from "@/components/shared/Button/Button";
import Link from "next/link";

export interface CmsInfoPopupAction {
  title: string;
  href?: string;
  onClick?: () => void;
}

type TCmsInfoProps = {
  show: boolean;
  contentKey: string;
  onHide: () => void | null;
  action: CmsInfoPopupAction;
};

const CmsInfoPopup = ({ show, onHide, action, contentKey }: TCmsInfoProps) => {
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
