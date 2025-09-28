"use client";
import _STRINGS from "@/utils/LocalStrings";
import React, { useEffect, useState } from "react";
import SinglePropertyPricePart from "../SinglePropertyPricePart";
import Button from "@/components/shared/Button/Button";
import { SinglePropDto } from "@/api_services/property/property.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import FavButton from "../FavButton";
import BookMarkButton from "../BookMarkButton";
import { PropertyService } from "@/api_services/property/property.service";
import AuthorizationStatus from "../AuthorizationStatus";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";
import SinglePropContactIfoPop from "./SinglePropContactInfoPop";
import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import SinglePropSharePop from "./SinglePropSharePop";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useRouter } from "next/navigation";
import SinglePropContactInfoModal from "./SinglePropContactInfoModal";
import { isMobile } from "react-device-detect";

const SinglePropertyIntroduction = ({ data }: { data: SinglePropDto }) => {
  const { isLogin } = useAuthStore((state) => state);
  const [favCount, setFavCount] = useState(0);
  const router = useRouter();
  const { userInfo } = useStoreInit((data) => data);
  const { isAdvisor } = useStoreParams((data) => data);
  const [showContact, setShowContact] = useState(false);
  const [showShare, setShowShare] = useState(false);
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
          <ShareLink passedHref={`${origin}/rooms/${data?.code}`} />
          <div className="flex items-center gap-1">
            <BookMarkButton data={data} />
          </div>
          <div className="flex items-center gap-1">
            <FavButton setFavCount={setFavCount} data={data} />
            <p className="text-xs  md:text-sm font-light   ">{favCount}</p>
          </div>
        </div>

        <div>
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

          {!!data?.is_promoted ? (
            <p className="  font-bold  text-primary-700  shrink-0  text-sm  hidden md:flex ">{_STRINGS.LADDERED}</p>
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
      <div className="flex items-center gap-2   py-0.5 w-full md:justify-between">
        <div className="flex items-center gap-1">
          {data?.is_promoted && !!isMobile ? (
            <p className="  font-bold  text-primary-700  shrink-0  text-xs  pl-1 border-l">{_STRINGS.LADDERED}</p>
          ) : (
            // <img className=" h-6" src="/assets/icons/adds/pin_point_location.svg" />

            <></>
          )}
          <p className=" hidden md:flex">{_STRINGS.PROPERTY_LOC} :</p>
        </div>
        <p className=" text-xs md:text-sm">
          {data?.city} <span className=" font-light">({data?.province})</span>
        </p>
      </div>
      <div className="w-full  hidden md:flex  items-center justify-between gap-4 ">
        <Button
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
        )}
      </div>
      <div className="z-20 flex md:hidden">
        <FixedBottomContainer>
          {" "}
          <div className="w-full  px-4  flex items-center justify-between gap-4 ">
            <Button
              onClick={onContactClick}
              width="w-full  !py-2  !font-bold  !text-sm "
              containerClass="w-full"
              roundedClass="rounded-full"
              title={_STRINGS.CONTACT_INFO}
            />
            <Button
              width="w-full !py-2  !font-bold !text-sm "
              containerClass="w-full  "
              roundedClass="rounded-full"
              title={_STRINGS.CHAT_IN_JAYAB}
              onClick={onCreateChat}
              loading={isPending}
            />
          </div>
        </FixedBottomContainer>
      </div>
      <div className="absolute">
        {" "}
        {/* <SinglePropContactIfoPop show={!!showContact} data={data} onHide={onContactClose} /> */}
        <SinglePropContactInfoModal show={!!showContact} data={data} onHide={onContactClose} />
        <SinglePropSharePop show={!!showShare} data={data} onHide={onShareClose} />
      </div>
    </div>
  );
};

export default SinglePropertyIntroduction;
