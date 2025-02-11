"use client";
import { CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import CreateEditSimpleAdvisor from "@/components/Advisor/CreateEditSimpleAdvisor";
import CreateEditSpecialAdvisor from "@/components/Advisor/CreateEditSpecialAdvisor";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import { useStoreInit } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CreateYourAdvisor = () => {
  const router = useRouter();
  const params = useParams();
  const { subscription_key } = params;
  const [values, setValues] = useState<
    CreateAdvisorDto & {
      province?: string | number | null;
      profile_image: any;
      national_card_image: any;
      document_image: any;
    }
  >({
    address: "",
    // area_code: "",
    cityIds: [],
    document_image: null,
    full_name: "",
    is_special: false,
    national_card_image: null,
    national_code: "",
    profile_image: null,
    tel: "",
    province: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: AdvisorService.createAdvisor,
    onSuccess: (e) => {
      if (!!e) {
        useStoreInit.setState({ userInfo: e });
      }
      router.back();
    },
  });
  const onSubmit = () => {
    mutate({
      address: values?.address || "",
      // area_code: values?.area_code,
      cityIds: !isEmpty(values?.cityIds) ? values?.cityIds?.map((e) => e?.id) : undefined,
      full_name: values?.full_name,
      is_special: subscription_key == "is-especial" ? true : false,
      national_code: values?.national_code || undefined,
      tel: values?.tel || undefined,
      document_image_id: values?.document_image?.id || undefined,
      national_card_image_id: values?.national_card_image?.id || undefined,
      profile_image_id: values?.profile_image?.id || undefined,
    });
  };

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY],

    queryFn: () => {
      return AdvisorService.userAdvisorsProfile();
    },
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (!!advisorProfile) {
      setValues({
        document_image: advisorProfile.document_image,
        full_name: advisorProfile?.user?.full_name,
        tel: advisorProfile?.tel,
        profile_image: advisorProfile?.user?.profile_image,
        national_code: advisorProfile?.national_code,
        national_card_image: advisorProfile?.national_card_image,
        cityIds: advisorProfile?.cities,
        address: advisorProfile?.address,
        is_special: subscription_key == "is-especial" ? true : false,
      });
    }
  }, [advisorProfile]);

  return (
    <div className="profile-container w-full">
      {subscription_key == "is-especial" ? (
        <CreateEditSpecialAdvisor setValues={setValues} values={values} />
      ) : (
        <CreateEditSimpleAdvisor setValues={setValues} values={values} />
      )}

      <FixedBottomContainer>
        <Button
          onClick={() => {
            onSubmit();
          }}
          loading={isPending}
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.ENTER_AND_MOVE_ON}
        />
      </FixedBottomContainer>
    </div>
  );
};

export default CreateYourAdvisor;
