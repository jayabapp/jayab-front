"use client";

import AddCard from "@/components/Adds/AddCard";

export default function Home() {
  return (
    <div
      id="homeParent"
      className="container  items-center !pt-12  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
    >
      <div className=" md:grid md:grid-cols-6">
        {" "}
        <AddCard />
      </div>
    </div>
  );
}
