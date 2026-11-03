export type {
  OwnerProfileDto,
  GetProfileDto,
} from "@/api_services/auth/auth.interface";

import type {
  OwnerProfileDto,
  GetProfileDto,
} from "@/api_services/auth/auth.interface";

export type OwnerRegistrationFormProps = {
  profile?: GetProfileDto;
  ownerProfile?: OwnerProfileDto;
};
