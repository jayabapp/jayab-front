import _STRINGS from "@/utils/LocalStrings";
import Modal from "../Modal";
import { Divider } from "../shared/Divider";
import SimpleLoading from "../shared/Lotties/SimpleLoading";

type TermsTypes = {
  visibleTermsModal: boolean;

  setvisibleTermsModal: (e: boolean) => void | null;
  termsLoading: boolean;
  termsContent?: { html?: string; full_text?: string };
};

const Terms = ({ visibleTermsModal, setvisibleTermsModal, termsLoading, termsContent }: TermsTypes) => {
  return (
    <Modal show={visibleTermsModal} onHide={() => setvisibleTermsModal(false)}>
      <div className="app-text">
        <div className="app-text flex justify-between items-center py-3 px-4 sticky top-0 bg-white dark:bg-zinc-800 z-10">
          <h3 className="mr-2 font-medium">{_STRINGS.TERMS}</h3>
          <img
            src="/assets/icons/shared/close.svg"
            className="w-4 h-4 dark:invert"
            alt=""
            onClick={() => setvisibleTermsModal(false)}
          />
        </div>
        <Divider moreClass="border-dashed mb-3" />
        {termsLoading ? (
          <div className="w-full flex justify-center my-4">
            <SimpleLoading />
          </div>
        ) : (
          <div
            className="  bg-neutral-200 dark:bg-zinc-800 font-light text-sm px-2 py-3 rounded-lg  content text-justify mx-2 lg:mx-4 leading-6 my-2 "
            dangerouslySetInnerHTML={{ __html: termsContent?.html || "" }}
          />
        )}
      </div>
    </Modal>
  );
};

export default Terms;
