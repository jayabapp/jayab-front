"use client";
import { AuthService } from "@/api_services/auth/auth.service";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import EditCreateUserPage from "@/components/SinglePageComponents/EditCreateUserPage";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditCreateProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get("redirect_url");

  const [values, setValues] = useState<{
    name: string;
    national_code: string;
    image: any;
  }>({
    national_code: "",
    name: "",
    image: null,
  });

  const onChange = (value: string | number | null, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.RegisterOwner,
    onSuccess: () => {
      if (!!redirect_url) {
        router.push(redirect_url);
      }
    },
  });

  const onSubmit = () => {
    mutate({ full_name: values.name, national_code: values.national_code, selfie_image_id: values.image?.id });
  };

  const { data } = useQuery({
    queryKey: [AuthService.GET_OWNER_PROFILE_CACHEKEY],

    queryFn: AuthService.GetOwnerProfile,
    staleTime: 0,
  });

  useEffect(() => {
    if (!!data) {
      setValues({ image: data?.selfie_image, national_code: data?.national_code, name: data?.user?.full_name });
    }
  }, [data]);

  return (
    <div
      id="homeParent"
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.PERSONAL_INFO} />
      <EditCreateUserPage values={values} onChange={onChange} />
      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.CHECK_CREDENTIOALS}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default EditCreateProfile;
