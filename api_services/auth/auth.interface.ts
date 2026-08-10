export interface ImageDto {
  id: number;
  user_id: null;
  admin_id: number;
  name: string;
  meta: null;
  thumbnail: string;
  type: number;
  path: string;
  bucket: string;
  region: null;
  end_point: string;
  medium: string;
  alt: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export type SendOtpDto = { mobile_number: string | number | null };
export type SendForgetOtpDto = {
  auth_param: string | number | null;
  forget_type: string | null;
};
export type ConfirmForgetOtpDto = {
  auth_param: string | number | null;
  forget_type: string | null;
  code: string | null;
};
export type SendOtpType = { code: number };

export type OtpChallengeDto = { masked_mobile: string; expires_at: string };

export type SendOtpVerify = {
  code: number | null | string;
  query_params?: any;
};

export type SendOtpVerifyWithMobile = {
  mobile_number: number | null | string;
  code: number | null | string;
};

export type SendOtpVerifyResponse = {
  needs_registration?: boolean;
  socket_token?: string;
};
export type CheckUserName = { username: string };
export type CheckUserNameResponse = any;
export type SetPassword = {
  username?: string;
  password: string | null;
  password_confirm: string | null;
};
export type SetNewPassword = {
  password: string | null;
  password_confirm: string | null;
  auth_param: string | null;
  forget_type: string;
  code: string;
};
export type SetDetailResponse = any;
export type SetDetail = {
  birthday: {
    year: string | number | null;
    month: string | number | null;
    day: string | number | null;
  } | null;
  profile_image_id: string | number | null;
  city_id: string | number | null;
  full_name: string | number | null;
};
export type SetPasswordResponse = any;
export type SignInDTO = {
  password: string | number | null;
  auth_param: string | number | null;
};
export type SignInResponseDTO = any;

export interface ForgetasswordListDto {
  [key: string]: string | null;
}

export interface Member {
  national_code: string;
  ancestor_name: string;
  birthday: string;
  profile: Profile;
  telephone_number: string;
  city: City;
  home_address: string;
  work_address: string;
  created_at: string;
}

export interface City {
  id: number;
  title: string;
}

export interface Profile {
  id: number;
  user_id: number;
  admin_id: null;
  name: string;
  meta: null;
  thumbnail: string;
  type: number;
  path: string;
  bucket: string;
  region: null;
  end_point: string;
  medium: string;
  alt: null;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export type UpdateProfileDto = {
  full_name: string;
};

export interface RegisterDto {
  full_name: string;
  national_code: string;
  selfie_image_id: number;
}

export interface User {
  id: number;
  mobile_number: string;
  full_name: string;
  father_name: string;
  gender: number;
  is_show: boolean;
  can_see_members: boolean;
  member_id: null;
  deceased_info_id: null;
  fcm_token: null;
  jwt_level: number;
  notification_read_at: string;
  created_at: string;
  updated_at: string;
}

export interface CitiesDto {
  id: number;
  title: string;
  child: Child[];
}

export interface Child {
  id: number;
  title: string;
}

export interface DefaultAddressDto {
  id: number;
  user_id: number;
  title: string;
  address: string;
  address_detail: string;
  lat: number;
  lng: number;
  recipient_full_name: string;
  recipient_phone_number: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

export interface GetProfileDto {
  id: number;
  owner_id: string;
  created_at: Date;
  full_name: string;
  advisor_id: string;
  mobile_number: string;
  profile_image: ImageDto;
  advisor: { is_special: boolean };
}

export interface OwnerProfileDto {
  id: number;
  status: number;
  created_at: Date;
  national_code: string;
  selfie_image: ImageDto;
  admin_descriptions: any[];
  user: { full_name: string };
}

export interface InitDto {
  bookmarks: number[];
  favorites: number[];
  isValidAdvisor: { isAdvisor: boolean };
}
