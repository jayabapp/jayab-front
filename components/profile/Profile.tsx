import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { UserService } from "@/api_services/user/user.service";
import { useAuthStore, useStoreInit } from "@/store";
import { profileItems } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useMutation } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";
import ConfirmModal from "../Modal/ConfirmModal";
import Button from "../shared/Button/Button";
import MainUploader from "../uploader";
import ProfileItem from "./ProfileItem";

const Profile = ({}) => {
  const [profileImage, setProfileImage] = useState<any>(null);
  const router = useRouter();
  const { isLogin } = useAuthStore((state) => state);
  const [isVisible, setisVisible] = useState(false);
  const { userInfo } = useStoreInit((state) => state);

  const logoutProcess = () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("isLogin");
    localStorage.removeItem("is_registered");
    useAuthStore.setState({ isLogin: false });
    useStoreInit.setState({ userInfo: null });
    router.push("/");
  };

  const _logout = () => {
    logoutProcess();
  };

  const platformProfileList = isMobile ? profileItems : profileItems?.filter((e) => !e?.isMobile);

  const goToLogin = () => {
    router.push("/auth");
  };

  useEffect(() => {
    if (!!userInfo) {
      setProfileImage(userInfo?.profile_image);
    }
  }, [userInfo]);

  const { mutate } = useMutation({
    mutationFn: UserService.updateProfileImage,
    onSuccess: (e) => {
      if (!!e) useStoreInit.setState({ userInfo: e });
    },
  });

  return (
    <div className="  z-5 w-full">
      {isVisible && (
        <ConfirmModal
          text={_STRINGS.LOG_OUT_MESSAGE}
          isVisible={isVisible}
          isLoading={false}
          title={_STRINGS.LOGGING_OUT}
          onHide={() => setisVisible(false)}
          confirmText={_STRINGS.YES}
          hideText={_STRINGS.NO}
          onConfirm={_logout}
        />
      )}
      <div className=" bg-white    rounded-20  flex flex-col gap-2 pb-10 overflow-scroll    dark:border dark:border-zinc-600 dark:shadow-none ">
        <div className="flex items-center px-2 py-2   dark:border-zinc-500 ">
          <MainUploader
            innerClasses={{
              secontParentClass: "!rounded-full   !aspect-auto ",
              sizeClass: " !rounded-full !w-20 !h-20",
              imageClass: " !rounded-full ",
            }}
            title={_STRINGS.IMAGE}
            withCrop
            // isLogo
            link="/attachments?type=PROFILE"
            key={`uploader`}
            containerClass={"my-3  relative w-fit flex items-start justify-start "}
            item={profileImage}
            onSelect={(file) => {
              mutate({ profile_image_id: file?.id });
              setProfileImage(file);
            }}
            // onDelete={() => {
            //   setProfileImage(null);
            // }}

            showCamera={true}
          />

          <div className="flex flex-col justify-evenly">
            <h1 className="text-left w-fit text-[14px] font-bold py-1 px-2  text-truncate">
              {userInfo?.full_name ? `${userInfo?.full_name}` : ""}
            </h1>
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
          />
        ) : (
          <></>
        )}
        {/* {!!userInfo?.owner_id ? (
          <ProfileItem
            disableArrow
            item={{
              id: 1214,
              imgSrc: "/assets/icons/header/header_my_adds.svg",
              route: "/profile/owner/call-logs",

              title: "تماس های من",
            }}
            key={`mycalls`}
          />
        ) : (
          <></>
        )} */}

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
            <img src="/assets/icons/header/header_logout.svg" className="w-6 h-6  aspect-square " />{" "}
            <p className="text-base font-medium text-primary-150 "> {_STRINGS?.LOGOUT_TITLE}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
