"use client";
import PageHeaders from "@/components/headers/PageHeader";
import EditCreateUserPage from "@/components/SinglePageComponents/EditCreateUserPage";
import _STRINGS from "@/utils/LocalStrings";
import React, { useState } from "react";

const EditCreateProfile = () => {
  const [values, setValues] = useState<{
    name: string;
    national_code: string;
    image: any;
  }>({
    national_code: "",
    name: "",
    image: null,
  });

  const onChange = (value: string | number | null, key: string) => {
    setValues((e) => ({ ...e, [key]: value }));
  };
  return (
    <div
      id="homeParent"
      className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <PageHeaders title={_STRINGS.PERSONAL_INFO} />
      <EditCreateUserPage values={values} onChange={onChange} />
    </div>
  );
};

export default EditCreateProfile;
