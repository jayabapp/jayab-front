import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";
import { ImageDto } from "@/api_services/auth/auth.interface";

import _STRINGS from "@/utils/LocalStrings";
import Modal from "@elements/Modal";

type TShowContactProps = {
  data: any;
  show: boolean;
  onHide: () => void | null;
  image: ImageDto | undefined;
};

const ShowContactPop = ({ show, data, image, onHide }: TShowContactProps) => {
  return (
    <Modal onHide={onHide} show={show}>
      <div className="w-full  px-4 py-3 border-t first:border-t-0   flex flex-row items-center justify-between  ">
        <div className="flex flex-row items-center gap-3 ">
          <ContentImage
            src={
              !!image && !!data?.is_owner
                ? NEW_IMAGE_URL(image)
                : "/assets/images/add/wall_e_lover.png"
            }
            width={56}
            height={56}
            sizes="(min-width: 768px) 56px, 40px"
            alt={data?.assistant_full_name || ""}
            className={` w-10 h-10  md:w-14 md:h-14 aspect-square rounded-full ${
              !!image && !!data?.is_owner ? "border border-brand-600" : ""
            } `}
          />
          <div className="flex flex-col items-start gap-2">
            <p className=" text-xs md:text-sm ">
              {!!data?.is_owner ? _STRINGS.HOST : _STRINGS.OWNER_ASSIST} :{" "}
              {data?.assistant_full_name}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <p className=" text-xs md:text-sm ">
            {data?.assistant_mobile_number}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ShowContactPop;
