"use client";

import type { PropertyDraftFormOptions } from "@/types/features/owner-property";
import { usePropertyDraft } from "@features/owner-property/hooks/usePropertyDraft";
import { useCallback, useState } from "react";

export const usePropertyDraftForm = <TValues>(
  propertyId: string | number,
  createEmpty: () => TValues,
  { map, canSeed }: PropertyDraftFormOptions<TValues>,
) => {
  const { data: draft, isLoading } = usePropertyDraft(propertyId);
  const id = String(propertyId);

  const [state, setState] = useState(() => ({
    id,
    seeded: false,
    values: createEmpty(),
  }));

  let current = state;
  if (current.id !== id) current = { id, seeded: false, values: createEmpty() };
  if (!current.seeded && !!draft && (!canSeed || canSeed(draft)))
    current = { id, seeded: true, values: map(draft) };
  if (current !== state) setState(current);

  const setValues = useCallback(
    (update: TValues | ((previous: TValues) => TValues)) =>
      setState((previous) => ({
        ...previous,
        seeded: true,
        values:
          typeof update === "function"
            ? (update as (previous: TValues) => TValues)(previous.values)
            : update,
      })),
    [],
  );

  const onChange = useCallback(
    (value: unknown, key: string) =>
      setValues((previous) => ({ ...previous, [key]: value })),
    [setValues],
  );

  return { draft, isLoading, onChange, setValues, values: current.values };
};
