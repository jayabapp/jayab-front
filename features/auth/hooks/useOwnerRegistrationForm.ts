import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ownerProfileOptions } from "../api/auth.options";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { useRef, useState } from "react";
import { useRegisterOwner } from "./useRegisterOwner";
import { PropertyService } from "@/api_services/property/property.service";
import { p2e } from "@/helpers/NumberConverter";

import type { OwnerProfileDto } from "@/api_services/auth/auth.interface";
import type { GetProfileDto } from "@/api_services/auth/auth.interface";

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
  const queryClient = useQueryClient();
  const registerOwner = useRegisterOwner();
  const submitting = useRef(false);
  const propertyDraft = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY, "owner-registration"],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const onChange = (value: string | number | null, key: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const continueRegistration = async () => {
    const redirect = safeInternalPath(searchParams.get("redirect_url"));
    if (redirect) return router.push(redirect);
    const draft = await propertyDraft.refetch();
    if (draft.data)
      router.push(`/profile/owner/properties/${draft.data.id}/edit/initials`);
  };

  const submit = async () => {
    if (
      !values.name.trim() ||
      !/^\d{10}$/.test(p2e(values.national_code)) ||
      !values.image?.id ||
      submitting.current
    )
      return;
    submitting.current = true;
    const nationalCode = p2e(values.national_code);
    try {
      await registerOwner.mutateAsync({
        full_name: values.name.trim(),
        national_code: nationalCode,
        selfie_image_id: Number(values.image.id),
      });
      await continueRegistration();
    } catch {
      const saved = await queryClient
        .fetchQuery({ ...ownerProfileOptions(), staleTime: 0 })
        .catch(() => undefined);
      if (saved?.national_code === nationalCode) {
        await queryClient.invalidateQueries({
          queryKey: ownerProfileOptions().queryKey,
        });
        await continueRegistration();
      }
    } finally {
      submitting.current = false;
    }
  };

  return {
    submit,
    values,
    onChange,
    isPending: registerOwner.isPending || propertyDraft.isFetching,
  };
};
