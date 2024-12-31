"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import PageHeaders from "@/components/headers/PageHeader";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";

import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import CircularProgress from "@/components/shared/CircularProgress/CircularProgress";

function ConsultantModal() {
    return (
        <div className="max-h-full relative flex flex-col-reverse">
            <div className="lg:hidden">
                <PageHeaders title={_STRINGS.CONSULTANT_INFO} />
            </div>

            <footer className="sticky bottom-0 z-50 shadow-md w-full transition-all  h-16 px-6 flex items-center justify-between py-4 pb-8">
                <Button
                    width="flex items-center justify-center w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.RECORD_SCORE}
                />
            </footer>

            <main className="max-h-full flex flex-col gap-6 overflow-y-scroll p-8">
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

                <div className="flex flex-col gap-6 pt-6 px-12">
                    <div className="w-full grid grid-cols-2 items-center justify-around gap-6">
                        <div className="w-full mx-auto">
                            <CircularProgress
                                size="w-16 sm:w-24"
                                value={90}
                                color="#0070f3"
                                subtitle={_STRINGS.CONSULTANT_APPROACHES}
                                pStyles={{
                                    textColor: "#2F3237",
                                    pathColor: "#34C759",
                                    textSize: "270%",
                                }}
                            />
                        </div>
                        <div className="w-full mx-auto">
                            <CircularProgress
                                size="w-16 sm:w-24"
                                value={80}
                                color="#0070f3"
                                subtitle={_STRINGS.CONSULTANT_RESPONSIBILITY}
                                pStyles={{
                                    textColor: "#2F3237",
                                    pathColor: "#34C759",
                                    textSize: "270%",
                                }}
                            />
                        </div>
                    </div>
                    <div className="mx-auto">
                        <CircularProgress
                            size="w-16 sm:w-24"
                            value={75}
                            color="#0070f3"
                            subtitle={_STRINGS.FOLLOWUP_SPEED_RESPONSE}
                            pStyles={{
                                textColor: "#2F3237",
                                pathColor: "#34C759",
                                textSize: "240%",
                            }}
                        />
                    </div>
                </div>
            </main>

            <div className="lg:hidden">
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
        </div>
    );
}

export default ConsultantModal;
