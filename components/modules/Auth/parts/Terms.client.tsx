import type { AuthTermsProps } from "@/types/components/modules/auth";
import { Divider } from "@elements/Divider";

import CmsContentSkeleton from "@elements/Skeleton/CmsContentSkeleton";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";
import Image from "next/image";

const Terms = ({
  termsLoading,
  termsContent,
  visibleTermsModal,
  setvisibleTermsModal,
}: AuthTermsProps) => {
  return (
    <Modal show={visibleTermsModal} onHide={() => setvisibleTermsModal(false)}>
      <div className="app-text">
        <div className="app-text flex justify-between items-center py-3 px-4 sticky top-0 bg-white  z-10">
          <h3 className="mr-2 font-medium">{_STRINGS.TERMS}</h3>
          <Image
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 "
            src="/assets/icons/shared/close.svg"
            onClick={() => setvisibleTermsModal(false)}
          />
        </div>
        <Divider moreClass="border-dashed mb-3" />
        {termsLoading ? (
          <CmsContentSkeleton withImage={false} />
        ) : (
          <div
            className="  bg-neutral-200  font-light text-sm px-2 py-3 rounded-lg  content text-justify mx-2 lg:mx-4 leading-6 my-2 "
            dangerouslySetInnerHTML={{ __html: termsContent?.html || "" }}
          />
        )}
      </div>
    </Modal>
  );
};

export default Terms;
