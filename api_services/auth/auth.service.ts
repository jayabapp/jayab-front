import { YupValidator } from "@/utils/YupValidator";
import { apiRoutes } from "@/utils/urls";
import { apiCall } from "../common/apicall.helper";
import {
  ConfirmForgetOtpDto,
  GetProfileDto,
  InitDto,
  OwnerProfileDto,
  RegisterDto,
  SendForgetOtpDto,
  SendOtpDto,
  SendOtpType,
  SendOtpVerify,
  SendOtpVerifyResponse,
  SetNewPassword,
  SetPassword,
  SetPasswordResponse,
  SignInDTO,
  SignInResponseDTO,
  UpdateProfileDto,
} from "./auth.interface";

export class AuthService {
  static ADMIN_EDIT_VALIDATE_CACHEKEY = "HET_PROFILE";
  static FORGOT_PASSWORD_LIST_CACHEKEY = "FORGOT_PASSWORD_LIST";
  static GET_PROFILE_CACHEKEY = "HET_PROFILE";
  static CITIES_CACHEKEY = "CITIES";
  static AU4_CACHEKEY = "AU4";
  static APP_SETTINGS_CACHEKEY = "APP_SETTINGS";
  static GET_OWNER_PROFILE_CACHEKEY = "GET_OWNER_PROFILE";
  static CITIES_CHILDEREN_CACHEKEY = "CITIES_CHILDEREN";
  static AUTH_INIT_CACHEKEY = "AUTH_INIT";

  static async SignIn(dto: SignInDTO) {
    try {
      const result = await apiCall<SignInDTO, SignInResponseDTO>(
        "POST",
        apiRoutes.AU9,
        {
          password: dto.password,
          auth_param: dto.auth_param,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async sendOtp(dto: SendOtpDto) {
    try {
      const { sendOtpSchema } = await import("./auth.schema");
      await YupValidator<SendOtpDto>(dto, sendOtpSchema);
      const result = await apiCall<SendOtpDto, SendOtpType>(
        "POST",
        apiRoutes.AU1,
        {
          mobile_number: dto.mobile_number,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async sendForgetOtp(dto: SendForgetOtpDto) {
    try {
      const result = await apiCall<SendForgetOtpDto, SendOtpType>(
        "POST",
        apiRoutes.AU12,
        {
          auth_param: dto.auth_param,
          forget_type: dto.forget_type,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async confirmOtp(dto: SendOtpVerify) {
    try {
      const result = await apiCall<SendOtpVerify, SendOtpVerifyResponse>(
        "POST",
        apiRoutes.AU2,
        {
          mobile_number: dto.mobile_number,
          code: dto.code,
          query_params: dto?.query_params,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async confirmForgetOtp(dto: ConfirmForgetOtpDto) {
    try {
      const result = await apiCall<ConfirmForgetOtpDto, SendOtpVerifyResponse>(
        "POST",
        apiRoutes.AU13,
        {
          auth_param: dto.auth_param,
          forget_type: dto.forget_type,
          code: dto.code,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async confirmOtpRegister(dto: SendOtpVerify) {
    try {
      const result = await apiCall<SendOtpVerify, SendOtpVerifyResponse>(
        "POST",
        apiRoutes.AU10,
        {
          mobile_number: dto.mobile_number,
          code: dto.code,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async SetUserPass(dto: SetPassword) {
    try {
      const result = await apiCall<SetPassword, SetPasswordResponse>(
        "POST",
        apiRoutes.AU8,
        {
          password: dto?.password,
          password_confirm: dto?.password_confirm,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async SetUsersNewPass(dto: SetNewPassword) {
    try {
      const result = await apiCall<SetNewPassword, SetPasswordResponse>(
        "POST",
        apiRoutes.AU14,
        {
          password: dto?.password,
          password_confirm: dto?.password_confirm,
          auth_param: dto.auth_param,
          code: dto.code,
          forget_type: dto.forget_type,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async UploadUsersImage(dto: {
    formData: FormData;
    link: string;
    id?: string | number;
    onProgressCallBack?: (e: any) => void | null;
  }) {
    try {
      const result = await apiCall<FormData, SetPasswordResponse>(
        "POST",
        dto.link,
        dto.formData,
        {
          progressCallBack: dto.onProgressCallBack,
        },
      );
      return { result, id: dto?.id };
    } catch (e: any) {
      e.id = dto.id;
      throw e;
    }
  }

  static async GetProfile() {
    try {
      const result = await apiCall<unknown, GetProfileDto>(
        "GET",
        apiRoutes.AU4,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
  static async GetOwnerProfile() {
    try {
      const result = await apiCall<unknown, OwnerProfileDto>(
        "GET",
        apiRoutes.GET_OWNER_PROFILE,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async EditProfile(dto: UpdateProfileDto) {
    try {
      const result = await apiCall<UpdateProfileDto, unknown>(
        "PUT",
        apiRoutes.AU4,
        {
          full_name: dto?.full_name,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async RegisterOwner(dto: RegisterDto) {
    try {
      const result = await apiCall<RegisterDto, unknown>(
        "PUT",
        apiRoutes.REGISTER_OWNER,
        {
          full_name: dto.full_name,
          national_code: dto.national_code,
          selfie_image_id: dto.selfie_image_id,
        },
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
  static async initCall() {
    try {
      const result = await apiCall<unknown, InitDto>(
        "GET",
        apiRoutes.AUTH_INIT,
      );
      return result;
    } catch (e) {
      throw e;
    }
  }
}
