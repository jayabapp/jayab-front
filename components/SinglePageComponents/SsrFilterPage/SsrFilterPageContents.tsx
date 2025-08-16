import { SingleLandingDto } from "@/api_services/property/property.interface";
import React from "react";
import ContentRelatedTags from "./ContentRelatedTags";
import DOMPurify from "isomorphic-dompurify";
import { chunkArray } from "@/helpers/chunk-array.helper";
import LandingContentFaq from "./LandingContentFaq";

const SsrFilterPageContents = ({ data }: { data: SingleLandingDto }) => {
  return (
    <div className="w-full flex gap-4 flex-col ">
      {" "}
      {!!data?.related_landings ? <ContentRelatedTags data={data?.related_landings} /> : <></>}{" "}
      {data?.content?.html ? (
        <div
          className=" !text-justify  blogBody category_table transition-all leading-7 px-2 md:px-[5%] "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(data?.content?.html, { FORBID_ATTR: ["style"] }),
          }}
        />
      ) : (
        <></>
      )}
      {!!data?.content?.questions ? <LandingContentFaq data={data?.content?.questions} /> : <></>}
    </div>
  );
};

export default SsrFilterPageContents;
