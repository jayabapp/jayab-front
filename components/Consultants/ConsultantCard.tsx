import { fakeVilla, fakeConsultant } from "@/utils/faker";
import _STRINGS from "@/utils/LocalStrings";
import React from "react";
// import AddCardPricePart from "./AddCardPricePart";
import Link from "next/link";
import Image from "next/image";
import CircularProgress from "@/components/shared/CircularProgress/CircularProgress";

const ConsultantCard = () => {
    const data = fakeConsultant;
    return (
        <div className="w-full shadow-card rounded-2xl p-4 gap-0 md:gap-2 text-xs sm:text-base">
            <Link href={`/consultants/${data?.id}`}>
                <div className="w-full flex items-center justify-between gap-6">
                    <div className="w-2/6">
                        <div className="flex flex-col gap-2">
                            <div className="relative rounded-full bg-gray-300 overflow-hidden">
                                {data?.avatar ? (
                                    <Image
                                        alt={"#"}
                                        src={data?.avatar}
                                        width={300}
                                        height={300}
                                        className="w-full h-full aspect-square object-cover object-top"
                                    />
                                ) : (
                                    <div className="absolute inset-0">
                                        place holder image
                                    </div>
                                )}
                            </div>
                            {/* CODE  - LIKES */}
                            <div className="flex items-center justify-center gap-4">
                                <div className="bg-primary-700 rounded-md text-xs  px-2 py-1 text-white flex items-center justify-center">
                                    کد {data.code}
                                </div>
                            </div>
                        </div>
                    </div>
                    <aside className="w-full">
                        <div className="flex flex-col gap-3 sm:gap-4">
                            {/* TITLE */}
                            <div className="flex items-center gap-2">
                                <p className="text-lg sm:text-xl font-semibold">
                                    {data.name}
                                </p>
                            </div>
                            {/* CIRCULAR BARS */}
                            <div className="w-full flex items-center justify-between lg:justify-start gap-4">
                                <div>
                                    <CircularProgress
                                        size="w-full max-w-10 sm:max-w-12"
                                        value={80}
                                        color="#0070f3"
                                        label={_STRINGS.USERS_SATISFACTION}
                                        pStyles={{
                                            textColor: "#0070f3",
                                            pathColor: "#0070f3",
                                            textSize: "330%",
                                        }}
                                    />
                                </div>
                                <div>
                                    <CircularProgress
                                        size="w-full max-w-10 sm:max-w-12"
                                        value={data?.owners_satisfaction}
                                        color="#34C759"
                                        label={_STRINGS.OWNERS_SATISFACTION}
                                        pStyles={{
                                            textColor: "#34C759",
                                            pathColor: "#34C759",
                                            textSize: "330%",
                                        }}
                                    />
                                </div>
                            </div>
                            {/* LOCATION */}
                            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between">
                                <div className="flex items-center">
                                    <span>حوزه فعالیت:</span>
                                    <ul className="flex flex-wrap list-none ps-1">
                                        {data?.locations.map((item, index) => (
                                            <li className="" key={index}>
                                                {`${item} ${
                                                    index <=
                                                    data.locations.length - 2
                                                        ? " و"
                                                        : ""
                                                } `}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <span>سابقه: </span>
                                    <span className="text-nowrap">6 ماه</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </Link>
        </div>
    );
};

export default ConsultantCard;
