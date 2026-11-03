"use client";

import { usePropertyAuthorization } from "@features/owner-property/hooks/usePropertyAuthorization";
import { useState } from "react";

const LOCKED_STATUS_ID = 100;

export const usePropertyLicenseForm = (propertyId: string | number) => {
  const { data, isLoading, request, edit } =
    usePropertyAuthorization(propertyId);
  const id = String(propertyId);

  const [form, setForm] = useState<{
    id: string;
    seeded: boolean;
    docs: any[];
    nationalImage: any;
  }>({ docs: [], id, nationalImage: null, seeded: false });

  let current = form;
  if (current.id !== id)
    current = { docs: [], id, nationalImage: null, seeded: false };
  if (!current.seeded && !!data)
    current = {
      docs: data?.docs || [],
      id,
      nationalImage: data?.nc_image,
      seeded: true,
    };
  if (current !== form) setForm(current);

  const setDocs = (update: (previous: any[]) => any[]) =>
    setForm((previous) => ({
      ...previous,
      docs: update(previous.docs),
      seeded: true,
    }));

  const setNationalImage = (value: any) =>
    setForm((previous) => ({
      ...previous,
      nationalImage: value,
      seeded: true,
    }));

  const isPending = request.isPending || edit.isPending;

  const submit = (onDone: () => void) => {
    if (isPending) return;
    const payload = {
      docs: current.docs?.map((doc) => doc?.id) || [],
      nc_image_id: current.nationalImage?.id,
      property_id: id,
    };
    const mutation = data?.status ? edit : request;
    mutation.mutate(payload, { onSuccess: onDone });
  };

  return {
    docs: current.docs,
    isLoading,
    isLocked: data?.status?.id === LOCKED_STATUS_ID,
    isPending,
    nationalImage: current.nationalImage,
    setDocs,
    setNationalImage,
    status: data?.status,
    submit,
  };
};
