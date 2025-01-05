"use client";

import AddCard from "@/components/properties/PropertyCard";
import { fakeVilla } from "@/utils/faker";

export default function Home() {
  return (
    <div
      id="homeParent"
      className="container  items-center !pt-12  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className=" md:grid md:grid-cols-6"> {/* <AddCard data={fakeVilla} /> */}</div>
    </div>
  );
}
