import React from "react";
import { imageUrlBase } from "../../utils/urls";

type SocialListType = { list: { id: number | string; full_text: string; image_location: string }[] };

const SocialList = ({ list }: SocialListType) => {
  return (
    <>
      {list?.map((e) => (
        <a key={e.id} href={e.full_text} target="_blank" rel="noreferrer">
          <img src={imageUrlBase + e.image_location} className="w-6 object-contain ml-6 " />
        </a>
      ))}
    </>
  );
};

export default SocialList;
