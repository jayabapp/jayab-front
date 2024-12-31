"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import _STRINGS from "@/utils/LocalStrings";

import Modal from "@/components/Modal";
import Button from "@/components/shared/Button/Button";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import CircularProgress from "@/components/shared/CircularProgress/CircularProgress";
import PageHeaders from "@/components/headers/PageHeader";
import FixedBottomContainer from "@/components/shared/FixedBottomContainer";

const LazyLoadedComponent = dynamic(
    () => import("@/components/Consultants/ScoreConsultantModal"),
    {
        loading: () => <p>Loading...</p>, // Optional: Show a loading message
        ssr: false, // Optional: Disable server-side rendering if needed
    }
);

const Page = () => {
    // Step 1: Declare a state to control modal visibility
    const [showModal, setShowModal] = useState(false);

    // Step 2: Define a function to hide the modal
    const handleHideModal = () => {
        setShowModal(false);
    };

    // Step 3: Define a function to show the modal
    const handleShowModal = () => {
        setShowModal(true);
    };

    return (
        <>
            <div className="!bg-transparent transition-all duration-500 ease-in-out py-16 container">
                <PageHeaders title={_STRINGS.CONSULTANT_INFO} />

                <main className="flex flex-col gap-6 max-w-2xl mx-auto">
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
                                    subtitle={
                                        _STRINGS.CONSULTANT_RESPONSIBILITY
                                    }
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

                <FixedBottomContainer>
                    <div className="w-full px-4">
                        <Button
                            width="flex items-center justify-center w-full"
                            containerClass="w-full"
                            roundedClass="rounded-full"
                            title={_STRINGS.RECORD_SCORE}
                            onClick={handleShowModal}
                        />
                    </div>
                </FixedBottomContainer>
            </div>

            <Modal
                show={showModal} // Control visibility via state
                onHide={handleHideModal} // Pass the function to hide the modal
                type="bottom-sheet" // Optional: Can be omitted for default animation
                options={{
                    containerClass: "custom-modal-class", // Optional: Add custom styles to the modal container
                }}
            >
                {/* Step 5: Modal content goes here */}
                <div className="z-50 w-screen h-screen overflow-hidden lg:max-w-2xl mx-auto lg:max-h-[90vh] bg-white lg:shadow-card lg:rounded-2xl">
                    <header className="flex items-center justify-center sticky select-none z-[40]   shadow-md   bg-white w-full transition-all top-0 h-16 px-6 py-4">
                        <span className="font-semibold">ثبت امتیاز مشاور</span>
                        <button
                            onClick={handleHideModal}
                            className="text-2xl text-gray-500 absolute right-4 top-4"
                        >
                            x
                        </button>
                    </header>
                    <LazyLoadedComponent />
                </div>
            </Modal>
        </>
    );
};

export default Page;
