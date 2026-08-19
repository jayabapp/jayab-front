"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { Suspense, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isMobile, isTablet } from "react-device-detect";
import { profileItems } from "@/utils/constantss";
import { AuthService } from "@/api_services/auth/auth.service";
import { UserService } from "@/api_services/user/user.service";
import { endSession } from "@/helpers/session";
import { useRouter } from "next/navigation";

import ConfirmModal from "@/components/Modal/ConfirmModal";
import ProfileItem from "@/components/profile/ProfileItem";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import Button from "@/components/shared/Button/Button";

const MainUploader = dynamic(() => import("@/components/uploader"));

const Profile = () => {
  const [profileImage, setProfileImage] = useState<any>(null);
  const { owmerActiveReservesCount } = useStoreParams();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { isLogin } = useAuthStore((state) => state);

  const { data } = useQuery({
    queryKey: [AuthService?.GET_PROFILE_CACHEKEY, "profile_page", isLogin],
    queryFn: () => {
      if (isLogin) return AuthService?.GetProfile();
      else return null;
    },
  });

  useEffect(() => {
    if (!!data) {
      useStoreInit.setState({ userInfo: data });
      setProfileImage(data?.profile_image);
    }
  }, [data]);

  const logoutProcess = async () => {
    await endSession();
    useAuthStore.setState({ isLogin: false, isAdminSso: false });
    useStoreInit.setState({ userInfo: null });
    router.push("/");
  };

  const _logout = () => {
    void logoutProcess();
  };

  const goToLogin = () => {
    router.push("/auth");
  };

  const platformProfileList =
    isMobile || isTablet
      ? profileItems
      : profileItems?.filter((e) => !e?.isMobile);
  const PersonalProfileItems = isLogin
    ? platformProfileList?.filter((e) => !!e?.guard)
    : [];
  const SharedProfileItems = platformProfileList?.filter((e) => !e?.guard);

  const { mutate } = useMutation({
    mutationFn: UserService.updateProfileImage,
    onSuccess: (e) => {
      if (!!e) useStoreInit.setState({ userInfo: e });
    },
  });

  return (
    <div
      id="homeParent"
      className="  profile-container  flex flex-col gap-4  transition-all duration-500 ease-in-out "
    >
      {!isMobile && !isTablet ? (
        <div className="w-full flex gap-4 items-center justify-center flex-col pt-8 opacity-40">
          <img src="/assets/icons/logo/logo.svg" className="w-1/5" />
          <p className="text-sm font-medium">{_STRINGS.PLZ_SELECT_A_PAGE}</p>
        </div>
      ) : (
        <div className="flex flex-col mt-0 lg:mt-4 ">
          {!!data ? (
            <div className="flex items-center gap-2">
              <Suspense>
                <MainUploader
                  innerClasses={{
                    secontParentClass: "!rounded-full   !aspect-auto ",
                    sizeClass: " !rounded-full !w-20 !h-20",
                    imageClass: " !rounded-full ",
                  }}
                  title={_STRINGS.IMAGE}
                  withCrop
                  key={`uploader`}
                  item={profileImage}
                  link="/attachments?type=PROFILE"
                  containerClass={"my-3  w-fit flex items-start justify-start "}
                  onSelect={(file) => {
                    mutate({ profile_image_id: file?.id });
                    setProfileImage(file);
                  }}
                  showCamera
                />
              </Suspense>
              <div className="flex flex-col gap-3">
                <p className="font-bold">{data?.full_name}</p>
                <p className="text-sm">{data?.mobile_number}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="  p-2 rounded-10  mt-4">
            {!isEmpty(PersonalProfileItems) && !!data?.owner_id ? (
              <ProfileItem
                item={{
                  id: 1214,
                  imgSrc: "/assets/icons/header/header_my_adds.svg",
                  route: "/profile/owner/properties",
                  title: "آگهی های من",
                }}
                key={`profileItemowner`}
              />
            ) : (
              <></>
            )}
            {!isEmpty(PersonalProfileItems) && !!data?.owner_id ? (
              <ProfileItem
                item={{
                  id: 1214,
                  imgSrc: "/assets/icons/header/header_my_adds.svg",
                  route: "/profile/owner/reserves",
                  title: "درخواست های رزرو",
                }}
                badgeCounter={owmerActiveReservesCount}
                key={`profileItemowner`}
              />
            ) : (
              <></>
            )}
            {!isEmpty(PersonalProfileItems) && !!data?.owner_id ? (
              <ProfileItem
                item={{
                  id: 1215,
                  imgSrc: "/assets/icons/adds/header_upgrade_image.svg",
                  route: "/profile/owner/photo-upgrade-requests",
                  title: "درخواست های بهبود تصویر",
                }}
                key={`profileItemownerPhotoUpgradeRequests`}
              />
            ) : (
              <></>
            )}
            {!!data?.advisor_id ? (
              <ProfileItem
                item={{
                  id: 1214,
                  imgSrc: "/assets/icons/header/header_my_sub.svg",
                  route: "/profile//advisor/subscription",
                  title: "بخش مشاور",
                }}
                key={`profileItemSub`}
              />
            ) : (
              <></>
            )}
            {!!data?.advisor_id || !!data?.owner_id ? (
              <ProfileItem
                item={{
                  id: 1526,
                  imgSrc: "/assets/icons/header/header_my_turnovers.svg",
                  route: "/profile/my-payments",
                  title: "پرداخت های من",
                }}
                key={`myPayments`}
              />
            ) : (
              <></>
            )}
            {!isEmpty(PersonalProfileItems) ? (
              PersonalProfileItems?.map((e) => (
                <ProfileItem item={e} key={`profileItem${e?.id}`} />
              ))
            ) : (
              <></>
            )}{" "}
            {SharedProfileItems?.map((e) => (
              <ProfileItem item={e} key={`profileItem${e?.id}`} />
            ))}
            {!isLogin ? (
              <Button
                containerClass="   mt-8 w-full"
                width="w-full"
                title={_STRINGS?.LOGIN_TO_UR_ACCOUNT}
                onClick={() => {
                  goToLogin();
                }}
              />
            ) : (
              <div
                onClick={() => {
                  setShowLogout(true);
                }}
                className="py-5 flex   items-center w-full gap-3 xl:gap-6 cursor-pointer hover:scale-102 transition-all"
              >
                <img
                  src="/assets/icons/header/header_logout.svg"
                  className="w-6 h-6  aspect-square "
                />{" "}
                <p className=" text-sm xl:text-base  font-medium text-primary-150 ">
                  {" "}
                  {_STRINGS?.LOGOUT_TITLE}
                </p>
              </div>
            )}
          </div>{" "}
        </div>
      )}{" "}
      <ConfirmModal
        isLoading={false}
        onConfirm={_logout}
        isVisible={showLogout}
        hideText={_STRINGS.NO}
        confirmText={_STRINGS.YES}
        title={_STRINGS.LOGGING_OUT}
        text={_STRINGS.LOG_OUT_MESSAGE}
        onHide={() => setShowLogout(false)}
      />
    </div>
  );
};

export default Profile;
