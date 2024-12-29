"use client";
import { AuthService } from "@/api_services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CreateProperty = () => {
  const router = useRouter();

  const { data } = useQuery({ queryKey: [AuthService.AU4_CACHEKEY], queryFn: AuthService.GetProfile });
  useEffect(() => {
    if (!!data) {
      if (!data?.owner_id) {
        router.push("/profile/edit");
      }
    }
  }, [data]);
  return <div>CreateProperty</div>;
};

export default CreateProperty;
