import { useLocale, useTranslations } from "next-intl";
import { sanitizeCmsHtml } from "@/helpers/html.generator";
import { Divider } from "@elements/Divider";
import { dirOf } from "@/i18n/config";

import type { AuthTermsProps } from "@/types/components/modules/auth";

import CmsContentSkeleton from "@elements/Skeleton/CmsContentSkeleton";
import Modal from "@elements/Modal";

const Terms = ({
  termsLoading,
  termsContent,
  visibleTermsModal,
  setvisibleTermsModal,
}: AuthTermsProps) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const contentLocale = termsContent?.content_locale ?? "fa";

  return (
    <Modal show={visibleTermsModal} onHide={() => setvisibleTermsModal(false)}>
      <div className="app-text">
        <div className="app-text flex justify-between items-center py-3 px-4 sticky top-0 bg-surface  z-10">
          <h3 className="ms-2 font-medium">{t("terms")}</h3>
          <button
            type="button"
            aria-label={t("close")}
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface-hover"
            onClick={() => setvisibleTermsModal(false)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m6 6 12 12M6 18 18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <Divider moreClass="border-dashed mb-3" />
        {termsLoading ? (
          <CmsContentSkeleton withImage={false} />
        ) : !termsContent ? (
          <p role="status" className="px-4 py-6 text-sm text-ink-muted">
            {t("error")}
          </p>
        ) : (
          <>
            {contentLocale !== locale && (
              <p role="status" className="mx-4 mb-3 text-sm text-ink-muted">
                {t("termsOriginalLanguageNotice")}
              </p>
            )}
            <div
              lang={contentLocale}
              dir={dirOf(contentLocale)}
              className="bg-surface-hover font-light text-sm px-2 py-3 rounded-lg content text-justify mx-2 lg:mx-4 leading-6 my-2 "
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(
                  termsContent.html || termsContent.full_text || "",
                ),
              }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default Terms;
