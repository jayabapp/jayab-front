import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useUpdateProfileImage } from "@features/notifications/hooks/useUpdateProfileImage";
import { useLogoutUser } from "@features/notifications/hooks/useLogoutUser";
import { profileItems } from "@/utils/constantss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isMobile } from "react-device-detect";

import MainUploader from "../uploader";
import ConfirmModal from "../Modal/ConfirmModal";
import ProfileItem from "./ProfileItem";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import Image from "next/image";

const Profile = ({}) => {
  const { owmerActiveReservesCount } = useStoreParams();
  const router = useRouter();
  const { isLogin } = useAuthStore((state) => state);
  const [isVisible, setisVisible] = useState(false);
  const { userInfo } = useStoreInit((state) => state);

  const logoutProcess = useLogoutUser();

  const _logout = () => {
    void logoutProcess();
  };

  const platformProfileList = isMobile
    ? profileItems
    : profileItems?.filter((e) => !e?.isMobile);

  const goToLogin = () => {
    router.push("/auth");
  };

  const { mutate } = useUpdateProfileImage();

  return (
    <div className="  z-5 w-full">
      {isVisible && (
        <ConfirmModal
          isLoading={false}
          onConfirm={_logout}
          isVisible={isVisible}
          hideText={_STRINGS.NO}
          confirmText={_STRINGS.YES}
          title={_STRINGS.LOGGING_OUT}
          text={_STRINGS.LOG_OUT_MESSAGE}
          onHide={() => setisVisible(false)}
        />
      )}
      <div className=" bg-white    rounded-20  flex flex-col gap-2 pb-10 overflow-scroll       ">
        <div className="flex items-center px-2 py-2    ">
          <MainUploader
            innerClasses={{
              secontParentClass: "!rounded-full   !aspect-auto ",
              sizeClass: " !rounded-full !w-20 !h-20",
              imageClass: " !rounded-full ",
            }}
            title={_STRINGS.IMAGE}
            withCrop
            link="/attachments?type=PROFILE"
            key={`uploader`}
            containerClass={
              "my-3  relative w-fit flex items-start justify-start "
            }
            item={userInfo?.profile_image}
            onSelect={(file) => {
              mutate({ profile_image_id: file?.id });
            }}
            showCamera={true}
          />

          <div className="flex flex-col justify-evenly">
            <p className="text-left w-fit text-[14px] font-bold py-1 px-2  text-truncate">
              {userInfo?.full_name ? `${userInfo?.full_name}` : ""}
            </p>
            <p className="text-right font-light px-2 py-1 flex  text-truncate items-center">
              {userInfo?.mobile_number}
            </p>
          </div>
        </div>
        {!!userInfo?.owner_id ? (
          <ProfileItem
            disableArrow
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
        {!!userInfo?.owner_id ? (
          <ProfileItem
            disableArrow
            item={{
              id: 1214,
              imgSrc: "/assets/icons/header/header_my_adds.svg",
              route: "/profile/owner/reserves",
              title: "درخواست های رزرو",
            }}
            key={`profileItemownerReserve`}
            badgeCounter={owmerActiveReservesCount}
          />
        ) : (
          <></>
        )}
        {!!userInfo?.owner_id ? (
          <ProfileItem
            disableArrow
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
        {!!userInfo?.advisor_id ? (
          <ProfileItem
            disableArrow
            item={{
              id: 24124,
              imgSrc: "/assets/icons/header/header_my_sub.svg",
              route: "/profile/advisor/subscription",
              title: "بخش مشاور",
            }}
            key={`profileIt124emowner`}
          />
        ) : (
          <></>
        )}
        {!!userInfo?.advisor_id || !!userInfo?.owner_id ? (
          <ProfileItem
            disableArrow
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
        {platformProfileList?.map((i) => (
          <ProfileItem disableArrow key={`${i?.id}PROFILECOMPONENT`} item={i} />
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
              setisVisible(true);
            }}
            className="py-5 flex   items-center w-full gap-3 md:gap-4 cursor-pointer hover:scale-102 transition-all"
          >
            <Image
              src="/assets/icons/header/header_logout.svg"
              alt=""
              width={24}
              height={24}
              className="w-6 h-6  aspect-square "
            />{" "}
            <p className="text-base font-medium text-danger-500 ">
              {" "}
              {_STRINGS?.LOGOUT_TITLE}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
