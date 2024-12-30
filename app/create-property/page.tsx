"use client";
import { AuthService } from "@/api_services/auth/auth.service";
import CreateEditProperty from "@/components/Adds/CreateEditProperty";
import PageHeaders from "@/components/headers/PageHeader";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateProperty = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useQuery({ queryKey: [AuthService.AU4_CACHEKEY], queryFn: AuthService.GetProfile });
  const [values, setValues] = useState<{
    name: string;
    national_code: string;
    property_type: string;
  }>({
    national_code: "",
    name: "",
    property_type: "",
  });
  useEffect(() => {
    if (!!data) {
      if (!data?.owner_id) {
        router.push(`/profile/edit?redirect_url=${pathname}`);
      }
    }
  }, [data]);

  const onChange = (value: string | number | null, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  return (
    <div
      id="homeParent"
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.REGISTER_PROPERTY} />

      <StepShower steps={createPropertySteps} value={1} />

      <CreateEditProperty onChange={onChange} values={values} />
    </div>
  );
};

export default CreateProperty;
