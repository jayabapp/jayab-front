"use client";
import HomeSearchPart from "@/components/Home/HomeSearchPart";
import { Suspense } from "react";

export function HomeSearchPartWrapper() {
  return (
    <Suspense fallback={null}>
      <HomeSearchPart />
    </Suspense>
  );
}
