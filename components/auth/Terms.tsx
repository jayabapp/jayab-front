import { Divider } from "@elements/Divider";

import CmsContentSkeleton from "../shared/CmsContentSkeleton";
import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";

type TTermsTypes = {
  visibleTermsModal: boolean;
  setvisibleTermsModal: (e: boolean) => void | null;
  termsLoading: boolean;
  termsContent?: { html?: string; full_text?: string };
};

const Terms = ({
  termsLoading,
  termsContent,
  visibleTermsModal,
  setvisibleTermsModal,
}: TTermsTypes) => {
  return (
    <Modal show={visibleTermsModal} onHide={() => setvisibleTermsModal(false)}>
      <div className="app-text">
        <div className="app-text flex justify-between items-center py-3 px-4 sticky top-0 bg-white  z-10">
          <h3 className="mr-2 font-medium">{_STRINGS.TERMS}</h3>
          <img
            src="/assets/icons/shared/close.svg"
            className="w-4 h-4 "
            alt=""
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
