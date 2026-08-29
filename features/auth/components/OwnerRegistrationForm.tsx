"use client";

import { useOwnerRegistrationForm } from "../hooks/useOwnerRegistrationForm";

import type { OwnerProfileDto } from "@/api_services/auth/auth.interface";
import type { GetProfileDto } from "@/api_services/auth/auth.interface";

import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import EditCreateUserPage from "@/components/SinglePageComponents/EditCreateUserPage";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

type TOwnerRegisterationProps = {
  profile?: GetProfileDto;
  ownerProfile?: OwnerProfileDto;
};

const OwnerRegistrationForm = ({
  profile,
  ownerProfile,
}: TOwnerRegisterationProps) => {
  const { values, onChange, submit, isPending } = useOwnerRegistrationForm(
    profile,
    ownerProfile,
  );
  return (
    <div className="profile-container flex flex-col items-center gap-6 bg-transparent">
      <EditCreateUserPage values={values} onChange={onChange} />
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
