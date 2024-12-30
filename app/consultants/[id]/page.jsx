"use client";

import React, { useState } from "react";
import Image from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import Button from "@/components/shared/Button/Button";

const SinglePropertyPage = () => {
    return (
        <div className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 ">
            <PageHeaders title={_STRINGS.SEARCH_ADD} />
            <ConsultantCard />
            <div className="w-full flex items-center justify-between gap-6">
                <Button
                    icon={
                        <>
                            <Image
                                src={"/assets/icons/shared/call.svg"}
                                width={20}
                                height={20}
                                alt="call icon"
                            />
                        </>
                    }
                    width="flex items-center justify-center w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.CALL}
                />
                <Button
                    icon={
                        <>
                            <Image
                                src={"/assets/icons/shared/message.svg"}
                                width={20}
                                height={20}
                                alt="call icon"
                            />
                        </>
                    }
                    color="light"
                    width="flex items-center justify-center w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.MESSAGE}
                    variant="outline"
                />
            </div>
            <div className="w-full flex items-center justify-center gap-6">

            </div>
        </div>
    );
};

export default SinglePropertyPage;
