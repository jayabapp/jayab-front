"use client";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { Suspense, useEffect, useState } from "react";
import { useUpdateProfileImage } from "@features/notifications/hooks/useUpdateProfileImage";
import { isMobile, isTablet } from "react-device-detect";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useLogoutUser } from "@features/notifications/hooks/useLogoutUser";
import { profileItems } from "@/utils/constantss";
import { useRouter } from "next/navigation";

import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import ProfileItem from "@/components/profile/ProfileItem";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import dynamic from "next/dynamic";
import Button from "@elements/Button";
import Image from "next/image";

const MainUploader = dynamic(() => import("@/components/uploader"));

const Profile = () => {
  const { owmerActiveReservesCount } = useStoreParams();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { isLogin } = useAuthStore((state) => state);

  const { data, isPending } = useCurrentProfile(isLogin);

  useEffect(() => {
    if (!!data) useStoreInit.setState({ userInfo: data });
  }, [data]);

  const logoutProcess = useLogoutUser();

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

  const { mutate } = useUpdateProfileImage();

  return (
    <div
      id="homeParent"
      className="  profile-container  flex flex-col gap-4  transition-all duration-500 ease-in-out "
    >
      {!isMobile && !isTablet ? (
        <div className="w-full flex gap-4 items-center justify-center flex-col pt-8 opacity-40">
          <Image
            alt=""
            width={160}
            height={80}
            className="w-1/5 h-auto"
            src="/assets/icons/logo/logo.svg"
          />
          <p className="text-sm font-medium">{_STRINGS.PLZ_SELECT_A_PAGE}</p>
        </div>
      ) : (
        <div className="flex flex-col mt-0 lg:mt-4 ">
          {isPending && isLogin ? <ProfileFormSkeleton /> : <></>}
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
                  item={data?.profile_image}
                  link="/attachments?type=PROFILE"
                  containerClass={"my-3  w-fit flex items-start justify-start "}
                  onSelect={(file) => {
                    mutate({ profile_image_id: file?.id });
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
                <Image
                  src="/assets/icons/header/header_logout.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6  aspect-square "
                />{" "}
                <p className=" text-sm xl:text-base  font-medium text-danger-500 ">
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
