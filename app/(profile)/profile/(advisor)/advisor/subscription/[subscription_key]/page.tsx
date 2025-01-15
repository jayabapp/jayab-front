"use client";
import { CreateAdvisorDto } from "@/api_services/advisor/advisor.interface";
import CreateEditSpecialAdvisor from "@/components/Advisor/CreateEditSpecialAdvisor";
import React, { useState } from "react";
import { boolean } from "yup";

const CreateYourAdvisor = () => {
  const [values, setValues] = useState<CreateAdvisorDto & { province: string | number | null }>({
    address: "",
    area_code: "",
    cityIds: [],
    document_image_id: "",
    full_name: "",
    is_special: false,
    national_card_image_id: "",
    national_code: "",
    profile_image_id: "",
    tel: "",
    province: "",
  });

  return (
    <div className="w-full">
      <CreateEditSpecialAdvisor setValues={setValues} values={values} />
    </div>
  );
};

export default CreateYourAdvisor;
