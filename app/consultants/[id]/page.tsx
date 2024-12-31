"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import PageHeaders from "@/components/headers/PageHeader";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";


import Button from "@/components/shared/Button/Button";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import CircularProgress from "@/components/shared/CircularProgress/CircularProgress";

const Page = () => {
    return (
        <div className="container items-center !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6">
            <PageHeaders title={_STRINGS.CONSULTANT_INFO} />
            <main className="flex flex-col gap-6">
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
                        width="flex items-center justify-center w-full"
                        containerClass="w-full"
                        roundedClass="rounded-full"
                        title={_STRINGS.MESSAGE}
                        variant="outline"
                    />
                </div>

                <div className="flex flex-col gap-6 pt-6">
                    <div className="w-full grid grid-cols-2 items-center justify-center gap-6">
                        <div className="mx-auto">
                            <CircularProgress
                                size="w-20 sm:w-24"
                                value={90}
                                color="#0070f3"
                                subtitle={_STRINGS.CONSULTANT_APPROACHES}
                                pStyles={{
                                    textColor: "#000",
                                    pathColor: "#34C759",
                                    textSize: "270%",
                                }}
                            />
                        </div>
                        <div className="mx-auto">
                            <CircularProgress
                                size="w-20 sm:w-24"
                                value={80}
                                color="#0070f3"
                                subtitle={_STRINGS.CONSULTANT_RESPONSIBILITY}
                                pStyles={{
                                    textColor: "#000",
                                    pathColor: "#34C759",
                                    textSize: "270%",
                                }}
                            />
                        </div>
                    </div>
                    <div className="mx-auto">
                        <CircularProgress
                            size="w-20 sm:w-24"
                            value={75}
                            color="#0070f3"
                            subtitle={_STRINGS.FOLLOWUP_SPEED_RESPONSE}
                            pStyles={{
                                textColor: "#000",
                                pathColor: "#34C759",
                                textSize: "270%",
                            }}
                        />
                    </div>
                </div>
            </main>

            <FixedBottomContainer>
                <Link className="w-full" href={"/consultants/1/record"}>
                    <Button
                        width="flex items-center justify-center w-full"
                        containerClass="w-full"
                        roundedClass="rounded-full"
                        title={_STRINGS.RECORD_SCORE}
                    />
                </Link>
            </FixedBottomContainer>
        </div>
    );
};

export default Page;
