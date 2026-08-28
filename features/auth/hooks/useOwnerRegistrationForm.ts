import { useRouter, useSearchParams } from "next/navigation";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useRegisterOwner } from "./useRegisterOwner";
import { PropertyService } from "@/api_services/property/property.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { p2e } from "@/helpers/NumberConverter";

import type { GetProfileDto } from "@/api_services/auth/auth.interface";
import type { OwnerProfileDto } from "@/api_services/auth/auth.interface";

export const useOwnerRegistrationForm = (
  profile?: GetProfileDto,
  ownerProfile?: OwnerProfileDto,
) => {
  const [values, setValues] = useState({
    name: ownerProfile?.user?.full_name || profile?.full_name || "",
    national_code: ownerProfile?.national_code || "",
    image: ownerProfile?.selfie_image || profile?.profile_image || null,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerOwner = useRegisterOwner();
  const propertyDraft = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, "owner-registration"],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const onChange = (value: string | number | null, key: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = () => {
    if (
      !values.name.trim() ||
      !/^\d{10}$/.test(p2e(values.national_code)) ||
      !values.image?.id
    )
      return;
    registerOwner.mutate(
      {
        full_name: values.name.trim(),
        national_code: p2e(values.national_code),
        selfie_image_id: Number(values.image.id),
      },
      {
        onSuccess: async () => {
          const redirect = safeInternalPath(searchParams.get("redirect_url"));
          if (redirect) return router.push(redirect);
          const draft = await propertyDraft.refetch();
          if (draft.data)
            router.push(
              `/profile/owner/properties/${draft.data.id}/edit/initials`,
            );
        },
      },
    );
  };

  return {
    submit,
    values,
    onChange,
    isPending: registerOwner.isPending || propertyDraft.isFetching,
  };
};
