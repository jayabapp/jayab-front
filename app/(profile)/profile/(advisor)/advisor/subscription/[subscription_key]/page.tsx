"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import CreateEditSimpleAdvisor from "@/components/Advisor/CreateEditSimpleAdvisor";
import CreateEditSpecialAdvisor from "@/components/Advisor/CreateEditSpecialAdvisor";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import { useStoreInit } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { useUpsertAdvisorProfile } from "@features/advisors/hooks/useUpsertAdvisorProfile";
import { mapAdvisorFormToRequest, mapAdvisorProfileToForm, type AdvisorFormValues } from "@features/advisors/mappers/advisor-profile.mapper";

const AdvisorForm = ({ initialValues, subscriptionKey }: { initialValues: AdvisorFormValues; subscriptionKey: string }) => {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const { mutate, isPending } = useUpsertAdvisorProfile();

  const onSubmit = () => mutate(mapAdvisorFormToRequest(values), {
    onSuccess: (profile) => {
      if (profile) useStoreInit.setState({ userInfo: profile });
      router.replace(`/profile/advisor/subscription?pay_key=${subscriptionKey}`);
    },
  });

  return (
    <div className="profile-container w-full">
      {values.is_special ? <CreateEditSpecialAdvisor setValues={setValues} values={values} /> : <CreateEditSimpleAdvisor setValues={setValues} values={values} />}
      <FixedBottomContainer>
        <Button onClick={onSubmit} loading={isPending} containerClass="w-full flex items-center justify-center" roundedClass="rounded-full" width="w-[90%] md:w-1/2" title={_STRINGS.ENTER_AND_MOVE_ON} />
      </FixedBottomContainer>
    </div>
  );
};

const CreateYourAdvisor = () => {
  const params = useParams<{ subscription_key: string }>();
  const subscriptionKey = params.subscription_key;
  const { data: profile, isPending } = useAdvisorProfile();

  if (isPending) return <div className="profile-container animate-pulse"><div className="h-12 rounded-xl bg-neutral-200" /><div className="mt-4 h-40 rounded-xl bg-neutral-100" /></div>;

  return <AdvisorForm key={`${profile?.id ?? "new"}-${subscriptionKey}`} initialValues={mapAdvisorProfileToForm(profile, subscriptionKey === "is-especial")} subscriptionKey={subscriptionKey} />;
};

export default CreateYourAdvisor;
