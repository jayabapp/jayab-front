"use client";
import { AuthService } from "@/api_services/auth/auth.service";
import { PropertyService } from "@/api_services/property/property.service";
import PageHeaders from "@/components/headers/PageHeader";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import EditCreateUserPage from "@/components/SinglePageComponents/EditCreateUserPage";
import { useAuthStore } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditCreateProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_url = searchParams.get("redirect_url");
  const { isLogin } = useAuthStore((state) => state);
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

  const {
    data: initPropData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.RegisterOwner,
    onSuccess: () => {
      if (!!redirect_url) {
        router.push(redirect_url);
      } else {
        refetch().then((e) => {
          if (!!e?.data) router.push(`/profile/owner/properties/${e?.data?.id}/edit/initials`);
        });
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

  const { data: profile } = useQuery({
    queryKey: [AuthService.AU4_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) {
        return AuthService.GetProfile();
      } else {
        return null;
      }
    },
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!!data || !!profile) {
      setValues({
        image: data?.selfie_image || profile?.profile_image,
        national_code: data?.national_code || "",
        name: data?.user?.full_name || profile?.full_name || "",
      });
    }
  }, [data, profile]);

  return (
    <div
      id="homeParent"
      className="profile-container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <EditCreateUserPage values={values} onChange={onChange} />
      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending || isLoading}
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
