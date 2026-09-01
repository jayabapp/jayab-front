"use client";

import type { OwnerRegistrationFormProps } from "@/types/components/modules/profile-editor";
import { useOwnerRegistrationForm } from "@features/auth/hooks/useOwnerRegistrationForm";

import OwnerRegistrationFields from "./parts/OwnerRegistrationFields.client";
import FixedBottomContainer from "@elements/FixedBottomContainer";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const OwnerRegistrationForm = ({
  profile,
  ownerProfile,
}: OwnerRegistrationFormProps) => {
  const { values, onChange, submit, isPending } = useOwnerRegistrationForm(
    profile,
    ownerProfile,
  );
  return (
    <div className="profile-container flex flex-col items-center gap-6 bg-transparent">
      <OwnerRegistrationFields values={values} onChange={onChange} />
      <FixedBottomContainer>
        <Button
          onClick={submit}
          loading={isPending}
          width="w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          title={_STRINGS.CHECK_CREDENTIOALS}
          containerClass="flex w-full items-center justify-center"
        />
      </FixedBottomContainer>
    </div>
  );
};

export default OwnerRegistrationForm;
