"use client";
import { ChatService } from "@/api_services/chat/chat.service";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import AutoFitText from "@/components/shared/AutoFitText";
import Button from "@/components/shared/Button/Button";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import AuthorizationStatus from "../AuthorizationStatus";
import BookMarkButton from "../BookMarkButton";
import FavButton from "../FavButton";
import SinglePropertyPricePart from "../SinglePropertyPricePart";
import SinglePropReservePop from "./SinglePropReservePop";
import SinglePropSharePop from "./SinglePropSharePop";

const SinglePropertyIntroduction = ({ data }: { data: SinglePropDto }) => {
  const { isLogin } = useAuthStore((state) => state);
  const [favCount, setFavCount] = useState(0);
  const router = useRouter();
  const { userInfo } = useStoreInit((data) => data);
  const { isAdvisor } = useStoreParams((data) => data);
  const [showContact, setShowContact] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [origin, setOrigin] = useState("");
  const { mutate: createFindChat, isPending } = useMutation({
    mutationFn: ChatService.StartOrFindChat,
    onSuccess: (e) => {
      router.push(`/chat/${e?.chatroom_id}`);
    },
  });

  const showLogin = () => {
    useStoreParams.setState({ loginModal: true });
  };

  useQuery({
    queryKey: [PropertyService.SINGLE_PROPERTY_UPDATE_VIEW_CACHEKEY, data?.id],
    queryFn: () => {
      const fingerprint = localStorage.getItem("visitor_id");
      if (!!fingerprint) {
        return PropertyService.updatePropertyView({ fingerprint: fingerprint, propertyId: data?.id });
      } else return null;
    },
  });

  const onCreateChat = () => {
    if (!!isLogin) {
      createFindChat({ property_id: data?.id });
    } else {
      showLogin();
    }
  };

  const onContactClick = () => {
    if (!!isLogin) {
      setShowContact(true);
    } else {
      showLogin();
    }
  };
  const onContactClose = () => {
    setShowContact(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                  SHARE POP                                 */
  /* -------------------------------------------------------------------------- */

  const onShareClick = () => {
    setShowShare(true);
  };
  const onShareClose = () => {
    setShowShare(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                  FAV COUNT                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!!data?.favorite_count) {
      setFavCount(data?.favorite_count || 0);
    }
  }, [data]);

  useEffect(() => {
    if (!!window.origin) setOrigin(window.origin);
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                   RESERVE                                  */
  /* -------------------------------------------------------------------------- */

  const onReserveClick = () => {
    if (!!isLogin) {
      setShowReserve(true);
    } else {
      showLogin();
    }
  };
  const onReserveHideClick = () => {
    setShowReserve(false);
  };

  const OwnerPart = () => {
    return (
      <div className="flex flex-row items-center gap-2 ">
        <img
          src={!!data?.owner_info ? NEW_IMAGE_URL(data?.owner_info?.avatar) : "/assets/images/add/wall_e_lover.png"}
          className={` size-10  md:size-12 aspect-square rounded-full 
              `}
        />
        <div className="flex flex-col  items-start gap-1">
          <p className="text-sm font-bold text-primary-700">{_STRINGS.HOST}</p>
          {/* <p className=" text-sm  text-primary-700 font-medium ">{data?.owner_info?.full_name}</p> */}
          <div className="w-36 relative">
            <AutoFitText
              maxFontSize={14}
              minFontSize={10}
              className="text-sm   w-36  text-primary-700 font-medium "
              text={`${data?.owner_info?.full_name}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" flex w-full  flex-col relative  gap-2 md:gap-3">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        <div className="flex items-center w-3/5 md:w-full gap-2">
          {!!data?.has_blue_tick ? (
            <img
              src="/assets/icons/adds/verified_badge.svg"
              alt="verified_badge"
              className="w-[1.125rem] h-[1.125rem]"
            />
          ) : (
            <></>
          )}
          <h1 className=" font-medium text-base w-full md:text-2xl  ">{data?.title}</h1>
        </div>
        {!!data?.is_authorized ? <AuthorizationStatus isAuthorized={data?.is_authorized} /> : <></>}
      </div>
      <div className=" flex items-center w-full justify-between">
        <div className="flex items-center gap-4 md:gap-4">
          <div className="bg-black/10 rounded-md text-xs md:text-sm  px-2 py-1  flex items-center justify-center">
            کد {data.code}
          </div>{" "}
          <ShareLink passedHref={`${origin}/rooms/${data?.code}-s`} />
          <div className="flex items-center gap-1">
            <BookMarkButton data={data} />
          </div>
          <div className="flex items-center gap-1">
            <FavButton setFavCount={setFavCount} data={data} />
            <p className="text-xs  md:text-sm font-light   ">{favCount}</p>
          </div>
        </div>

        <div className="flex  items-center gap-2">
          {!!data?.is_promoted ? (
            <p className="  font-bold  text-primary-700  shrink-0  text-sm  hidden lg:flex ">{_STRINGS.LADDERED}</p>
          ) : (
            <></>
          )}
          {!!isAdvisor && !!userInfo?.advisor_id ? (
            <Button
              onClick={onShareClick}
              title={_STRINGS.SEND_INFO}
              width=" text-xs !px-4 !py-1.5 "
              variant="flat"
              roundedClass="rounded-md"
              color="themeLight"
              icon={<img className=" ml-1" src="/assets/icons/property/share_icon.svg" />}
            />
          ) : (
            <></>
          )}
        </div>
      </div>{" "}
      {/*                          */}
      <div className="flex items-center gap-4  relative   py-0.5 w-full md:justify-between">
        <div className="flex items-center gap-1">
          <p className="w-20 md:text-sm text-xs ">{_STRINGS.TODAYS_PRICE} </p>
        </div>
        <SinglePropertyPricePart data={data} />
      </div>{" "}
      {/*                          */}
      <div className="flex items-center gap-4   py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs ">{_STRINGS.ROOM_COUNTS} :</p>
        <p className="font-bold text-sm md:text-base text-primary-700">
          {data?.total_bedrooms} {_STRINGS.ROOM}
        </p>
      </div>{" "}
      {/*                          */}
      <div className="flex items-center gap-4   py-0.5 w-full md:justify-between">
        <p className="w-20 md:text-sm text-xs ">{_STRINGS.ROOM_SIZE} :</p>
        <p className="font-bold text-sm md:text-base text-primary-700">
          {data?.building_area} {_STRINGS.METER}
        </p>
      </div>
      {/*                          */}
      {/* {!!userInfo?.advisor_id && data?.advisor_commission ? (
        <div className="flex items-center gap-2   py-0.5 w-full md:justify-between">
          <p className="min-w-[5.5rem] md:text-sm text-xs ">{_STRINGS.COMMIS_JUST_PERC} :</p>
          <p className="font-bold text-sm md:text-base text-primary-700">{data?.advisor_commission}%</p>
        </div>
      ) : (
        <></>
      )} */}
      <div className="flex items-center gap-2   py-0.5 w-full lg:justify-between">
        {data?.is_promoted && !!isMobile ? (
          <p className="  font-bold  text-primary-700  shrink-0  text-xs lg:hidden  pl-1 border-l">
            {_STRINGS.LADDERED}
          </p>
        ) : (
          // <img className=" h-6" src="/assets/icons/adds/pin_point_location.svg" />

          <></>
        )}
        <p className=" hidden lg:flex">{_STRINGS.PROPERTY_LOC} :</p>
        <p className=" text-xs lg:text-sm">
          {data?.city} <span className=" font-light">({data?.region || data?.province})</span>
        </p>
      </div>
      <div className="w-full bg-primary-700/20  rounded-full p-2  hidden md:flex  items-center justify-between gap-4 ">
        <OwnerPart />
        {/* <Button
          onClick={onContactClick}
          width="w-full"
          containerClass="w-full"
          roundedClass="rounded-full"
          title={_STRINGS.CONTACT_INFO}
        />
        {data?.is_chat_enabled ? (
          <Button
            width="w-full"
            containerClass="w-full"
            roundedClass="rounded-full"
            title={_STRINGS.CHAT_IN_JAYAB}
            onClick={onCreateChat}
            loading={isPending}
          />
        ) : (
          <></>
        )} */}

        <Button
          onClick={onReserveClick}
          width="w-full  !px-8 md:!py-2.5  lg:!py-2 lg:!text-lg"
          containerClass="w-1/4 flex items-center  justify-end"
          roundedClass="rounded-full"
          title={_STRINGS.RESERVE}
        />
      </div>
      <div className="z-20 flex md:hidden">
        <FixedBottomContainer>
          {" "}
          <div className="w-full flex  px-4">
            <div className="w-full  bg-primary-700/20  rounded-full p-2   flex items-center justify-between gap-4 ">
              <OwnerPart />
              {/* <Button
              onClick={onContactClick}
              width="w-full  !py-2  !font-bold  !text-sm "
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.CONTACT_INFO}
            />
            {data?.is_chat_enabled ? (
              <Button
                width="w-full !py-2  !font-bold !text-sm "
                containerClass="w-full  "
                roundedClass="rounded-full"
                title={_STRINGS.CHAT_IN_JAYAB}
                onClick={onCreateChat}
                loading={isPending}
              />
            ) : (
              <></>
            )} */}
              <Button
                onClick={onReserveClick}
                width="w-full !text-xl !py-1.5"
                // containerClass="w-full items-center  justify-center"
                containerClass="w-1/3   flex items-center  justify-end"
                roundedClass="rounded-full"
                title={_STRINGS.RESERVE}
              />
            </div>
          </div>
        </FixedBottomContainer>
      </div>
      <div className="absolute">
        {" "}
        {/* <SinglePropContactIfoPop show={!!showContact} data={data} onHide={onContactClose} /> */}
        <SinglePropSharePop show={!!showShare} data={data} onHide={onShareClose} />
        <SinglePropReservePop show={!!showReserve} data={data} setShow={setShowReserve} />
      </div>
    </div>
  );
};

export default SinglePropertyIntroduction;
