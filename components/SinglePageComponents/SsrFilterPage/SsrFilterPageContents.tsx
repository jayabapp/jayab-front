import { SingleLandingDto } from "@/api_services/property/property.interface";
import { LandingsContent } from "@modules/HomeContent";
import ContentRelatedTags from "./ContentRelatedTags";
import LandingContentFaq from "./LandingContentFaq";

const SsrFilterPageContents = ({ data }: { data: SingleLandingDto }) => {
  // const { html, headings, timeToRead, wordCount } = HTMLGenerator(data?.content?.html || "", {
  //   hasHeading: true,
  //   hasCount: true,
  // });

  return (
    <div className="w-full flex gap-4 flex-col ">
      {" "}
      {!!data?.related_landings ? <ContentRelatedTags data={data?.related_landings} /> : <></>}{" "}
      <LandingsContent data={data?.content} options={{ parentPadding: "px-2 md:px-[5%]" }} />
      {/* {html ? (
        <div
          className=" !text-justify  content blogBody category_table transition-all leading-7 px-2 md:px-[5%] "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(html),
          }}
        />
      ) : (
        <></>
      )} */}
      {!!data?.content?.questions ? <LandingContentFaq data={data?.content?.questions} /> : <></>}
    </div>
  );
};

export default SsrFilterPageContents;
