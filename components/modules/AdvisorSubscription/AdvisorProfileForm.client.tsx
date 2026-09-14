"use client";

import { mapAdvisorProfileToForm } from "@features/advisors/mappers/advisor-profile.mapper";
import { mapAdvisorFormToRequest } from "@features/advisors/mappers/advisor-profile.mapper";
import { findMissingAdvisorField } from "@features/advisors/mappers/advisor-profile.mapper";
import { useUpsertAdvisorProfile } from "@features/advisors/hooks/useUpsertAdvisorProfile";
import type { AdvisorProfileFormProps } from "@/types/components/modules/advisors";
import type { AdvisorFormBodyProps } from "@/types/components/modules/advisors";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { normalizeApiError } from "@/lib/api/api-error";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AdvisorSpecialFields from "./parts/AdvisorSpecialFields.client";
import AdvisorProfileFormSkeleton from "./AdvisorProfileFormSkeleton";
import AdvisorSimpleFields from "./parts/AdvisorSimpleFields.client";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const SPECIAL_KEY = "is-especial";

const AdvisorFormBody = ({
  initialValues,
  subscriptionKey,
}: AdvisorFormBodyProps) => {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const { mutate, isPending } = useUpsertAdvisorProfile();
  const onSubmit = () => {
    if (isPending) return;

    const missingField = findMissingAdvisorField(values);
    if (missingField) {
      toast.error(`لطفا فیلد «${missingField}» را تکمیل کنید.`);
      return;
    }

    mutate(mapAdvisorFormToRequest(values), {
      onSuccess: () =>
        router.replace(
          `/profile/advisor/subscription?pay_key=${subscriptionKey}`,
        ),
      onError: (error) => toast.error(normalizeApiError(error).message),
    });
  };

  return (
    <>
      {values.is_special ? (
        <AdvisorSpecialFields values={values} setValues={setValues} />
      ) : (
        <AdvisorSimpleFields values={values} setValues={setValues} />
      )}

      <FixedBottomContainer>
        <Button
          onClick={onSubmit}
          loading={isPending}
          disabled={isPending}
          width="w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.ENTER_AND_MOVE_ON}
          containerClass="flex w-full items-center justify-center"
        />
      </FixedBottomContainer>
    </>
  );
};

const AdvisorProfileForm = ({ subscriptionKey }: AdvisorProfileFormProps) => {
  const { data: profile, isPending } = useAdvisorProfile();
  if (isPending) return <AdvisorProfileFormSkeleton />;
  return (
    <AdvisorFormBody
      subscriptionKey={subscriptionKey}
      key={`${profile?.id ?? "new"}-${subscriptionKey}`}
      initialValues={mapAdvisorProfileToForm(
        profile,
        subscriptionKey === SPECIAL_KEY,
      )}
    />
  );
};

export default AdvisorProfileForm;
