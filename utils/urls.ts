export const Url = process.env.NEXT_PUBLIC_BASE_URL;
export const baseUrl = `${Url}/api/v1`;
export const imageUrl = `${Url}/`;
export const NEW_IMAGE_URL = (
  item?: { bucket: string; end_point: string; path: string; name: string; thumbnail: string; medium: string } | null,
  keyValue?: "name" | "thumbnail" | "medium"
) => {
  if (item?.bucket && item?.bucket != null)
    return `https://${item?.bucket}.${item?.end_point}/${item?.path}/${keyValue ? item[keyValue] : item?.name}`;
  else return "";
};
export const imageUrlBase = `${Url}/images/contents/`;
export const IMAGE_URL = (path: string) => `${Url}/${path}`;
export const bankUrl = (path: string) => `${Url}/images/bank/${path}`;

export const apiRoutes = {
  AU1: "/auth/otp",

  AU2: "/auth/otp/verify",

  AU3: "/user/register",

  AU4: "/profile",

  AU5: "/user/national-card/upload",

  AU6: "/user/legal/person",

  AU7: "/business/login",

  AU8: "/user/auth/set-password",

  AU9: "/user/auth/login",

  AU10: "/user/auth/register",

  AU12: "/user/forget-password/code/send",

  AU13: "/user/forget-password/code/verify",

  AU14: "/user/forget-password/reset",

  PROFILE_UPLOAD: "/attachments",

  CONTENT_BY_KEY: (id: string | number) => `/contents/by-key/${id}`,
};
