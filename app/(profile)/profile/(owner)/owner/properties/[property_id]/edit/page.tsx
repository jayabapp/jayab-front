"use client";

import { createPropertySteps } from "@/utils/constantss";
import Link from "next/link";
import { useParams } from "next/navigation";

const EditHub = () => {
  const params = useParams();

  const { property_id } = params;

  return (
    <div className="  profile-container  w-full   ">
      <div className="w-full grid    grid-cols-1 gap-2  md:grid-cols-2">
        {createPropertySteps(Number(property_id))?.map((e) => (
          <Link
            title={e?.full_title}
            key={`items${e?.id}`}
            href={`${e?.link}`}
            className="w-full border-primary-200  flex items-center justify-between  h-fit px-4 py-3 rounded-10 border"
          >
            <p className=" text-sm font-bold ">{e?.full_title}</p>

            <img className="rotate-90  " src="/assets/icons/shared/chevron.svg" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EditHub;
