"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import _STRINGS from "@/utils/LocalStrings";

import InstallPromt from "@/components/InstallPrompt";
import Modal from "@/components/Modal";

import { AuthService } from "@/api_services/auth/auth.service";
import CreateEditProperty from "@/components/Adds/CreateEditProperty";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/shared/Button/Button";
import FormInput from "@/components/shared/Form/FormInput";
import PageFooter from "@/components/Footer/PageFooter";
import Checkbox from "@/components/shared/Form/Checkbox";

const Page = () => {
    const [data, setData] = useState<any>();
    const [modalEntry, setModalEntry] = useState<number>(0);
    const [checkedStates, setCheckedStates] = useState<{
        [key: number]: boolean;
    }>({});
    const [selectAllStates, setSelectAllStates] = useState<{
        [key: number]: boolean;
    }>({});

    // throw new Error("messagr from me");

    // Step 1: Declare a state to control modal visibility
    const [showModal, setShowModal] = useState(true);
    // const [checkedStates, setCheckedStates] = useState<{
    //     [key: number]: boolean;
    // }>({});

    const handleModal = () => {
        setShowModal(!showModal);
    };

    const handleSelect = (cityId: number) => {
        setCheckedStates((prev) => ({
            ...prev,
            [cityId]: !prev[cityId], // Toggle the checked state of the specific checkbox
        }));
    };

    const handleSelectAll = (stateId: number, cities: any[]) => {
        const allSelected = cities.every((city) => checkedStates[city.id]);

        // If all cities are selected, deselect all; otherwise, select all
        const newState = cities.reduce((acc, city) => {
            acc[city.id] = !allSelected;
            return acc;
        }, {});

        setCheckedStates((prev) => ({
            ...prev,
            ...newState,
        }));

        // Update selectAllStates for the current state
        setSelectAllStates((prev) => ({
            ...prev,
            [stateId]: !allSelected,
        }));
    };

    const iranStatesAndCities = [
        {
            id: 1,
            state: { en: "Tehran", fa: "تهران" },
            cities: [
                { id: 1, en: "Tehran", fa: "تهران" },
                { id: 2, en: "Rey", fa: "ری" },
                { id: 3, en: "Eslamshahr", fa: "اسلامشهر" },
                { id: 4, en: "Shahriar", fa: "شهریار" },
                { id: 5, en: "Varamin", fa: "ورامین" },
                { id: 6, en: "Pakdasht", fa: "پاکدشت" },
            ],
        },
        {
            id: 2,
            state: { en: "Isfahan", fa: "اصفهان" },
            cities: [
                { id: 7, en: "Isfahan", fa: "اصفهان" },
                { id: 8, en: "Kashan", fa: "کاشان" },
                { id: 9, en: "Najafabad", fa: "نجف‌آباد" },
                { id: 10, en: "Shahreza", fa: "شهرضا" },
                { id: 11, en: "Khansar", fa: "خوانسار" },
                { id: 12, en: "Natanz", fa: "نطنز" },
            ],
        },
        {
            id: 3,
            state: { en: "Fars", fa: "فارس" },
            cities: [
                { id: 13, en: "Shiraz", fa: "شیراز" },
                { id: 14, en: "Marvdasht", fa: "مرودشت" },
                { id: 15, en: "Jahrom", fa: "جهرم" },
                { id: 16, en: "Fasa", fa: "فسا" },
                { id: 17, en: "Firouzabad", fa: "فیروزآباد" },
                { id: 18, en: "Larestan", fa: "لارستان" },
            ],
        },
        {
            id: 4,
            state: { en: "Khorasan Razavi", fa: "خراسان رضوی" },
            cities: [
                { id: 19, en: "Mashhad", fa: "مشهد" },
                { id: 20, en: "Neyshabur", fa: "نیشابور" },
                { id: 21, en: "Sabzevar", fa: "سبزوار" },
                { id: 22, en: "Torbat-e Heydarieh", fa: "تربت حیدریه" },
                { id: 23, en: "Quchan", fa: "قوچان" },
                { id: 24, en: "Chenaran", fa: "چناران" },
            ],
        },
        {
            id: 5,
            state: { en: "Mazandaran", fa: "مازندران" },
            cities: [
                { id: 25, en: "Sari", fa: "ساری" },
                { id: 26, en: "Amol", fa: "آمل" },
                { id: 27, en: "Babol", fa: "بابل" },
                { id: 28, en: "Qaemshahr", fa: "قائم‌شهر" },
                { id: 29, en: "Chalous", fa: "چالوس" },
                { id: 30, en: "Noshahr", fa: "نوشهر" },
            ],
        },
        {
            id: 6,
            state: { en: "East Azerbaijan", fa: "آذربایجان شرقی" },
            cities: [
                { id: 31, en: "Tabriz", fa: "تبریز" },
                { id: 32, en: "Maragheh", fa: "مراغه" },
                { id: 33, en: "Marand", fa: "مرند" },
                { id: 34, en: "Ahar", fa: "اهر" },
                { id: 35, en: "Sarab", fa: "سراب" },
                { id: 36, en: "Bonab", fa: "بناب" },
            ],
        },
        {
            id: 7,
            state: { en: "West Azerbaijan", fa: "آذربایجان غربی" },
            cities: [
                { id: 37, en: "Urmia", fa: "ارومیه" },
                { id: 38, en: "Khoy", fa: "خوی" },
                { id: 39, en: "Mahabad", fa: "مهاباد" },
                { id: 40, en: "Miandoab", fa: "میاندوآب" },
            ],
        },
        {
            id: 8,
            state: { en: "West Azerbaijan", fa: "آذربایجان غربی" },
        },
        {
            id: 9,
            state: { en: "West Azerbaijan", fa: "آذربایجان غربی" },
        },
        {
            id: 10,
            state: { en: "West Azerbaijan", fa: "آذربایجان غربی" },
        },
    ];

    const displayChildren = (id: number) => {
        setModalEntry(id);
    };

    return (
        <>
            {/* <div className="container items-center !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "></div> */}

            <button onClick={handleModal}>Show Modal</button>
            <Modal
                show={showModal} // Control visibility via state
                onHide={handleModal} // Pass the function to hide the modal
                type="bottom-sheet" // Optional: Can be omitted for default animation
                options={{
                    containerClass: "custom-modal-class", // Optional: Add custom styles to the modal container
                }}
            >
                {/* Step 5: Modal content goes here */}
                <div className="z-50 w-screen h-screen overflow-hidden lg:max-w-xl mx-auto lg:max-h-[90vh] bg-white lg:shadow-card lg:rounded-2xl overflow-y-auto">
                    <header className="flex items-center justify-center sticky select-none z-[40]   shadow-md   bg-white w-full transition-all top-0 h-16 px-6 py-4">
                        <span className="font-semibold">جستجوی استان</span>
                        {modalEntry === 0 ? (
                            <button
                                onClick={handleModal}
                                className="text-2xl text-gray-500 absolute right-4 top-4"
                            >
                                x
                            </button>
                        ) : (
                            <button
                                onClick={() => setModalEntry(0)}
                                className="text-2xl text-gray-500 absolute right-4 top-4"
                            >
                                {`<-`}
                            </button>
                        )}
                    </header>
                    <section className="h-full">
                        {modalEntry === 0 ? (
                            <ul>
                                {iranStatesAndCities.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between h-20 p-5 border cursor-pointer"
                                        onClick={() => displayChildren(item.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Image
                                                alt=""
                                                src="/assets/images/city.png"
                                                width={40}
                                                height={40}
                                                className="rounded"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <h3>{item.state.fa}</h3>
                                                <ul className="flex items-center gap-1 list-none p-0 m-0">
                                                    {item.cities
                                                        ?.slice(0, 6)
                                                        .map((city, index) => (
                                                            <li key={city.id}>
                                                                {city.fa}
                                                                {index <
                                                                    item.cities
                                                                        .length -
                                                                        1 &&
                                                                    "-"}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <button type="button">
                                            <Image
                                                alt=""
                                                src="/assets/icons/chevron-left.svg"
                                                width={16}
                                                height={16}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <ul>
                                {iranStatesAndCities
                                    .filter((item) => item.id === modalEntry) // Filter for the selected state
                                    ?.map((item) => (
                                        <li key={item.id}>
                                            {item?.cities &&
                                                item.cities.length > 0 && (
                                                    <div className="flex items-center justify-between p-5">
                                                        <span>
                                                            {
                                                                _STRINGS.ALL_CITIES
                                                            }
                                                        </span>
                                                        <Checkbox
                                                            isChecked={
                                                                selectAllStates[
                                                                    item.id
                                                                ] || false
                                                            }
                                                            onSelect={() =>
                                                                handleSelectAll(
                                                                    item.id,
                                                                    item.cities
                                                                )
                                                            }
                                                            containerClass="my-4"
                                                            rounded="rounded-lg"
                                                        />
                                                    </div>
                                                )}

                                            <ul>
                                                {item.cities?.map((city) => (
                                                    <li
                                                        key={city.id}
                                                        className="flex items-center justify-between h-20 p-5 border cursor-pointer"
                                                    >
                                                        <span>{city.fa}</span>
                                                        <Checkbox
                                                            isChecked={
                                                                checkedStates[
                                                                    city.id
                                                                ] || false
                                                            }
                                                            onSelect={() =>
                                                                handleSelect(
                                                                    city.id
                                                                )
                                                            }
                                                            containerClass="my-4"
                                                            rounded="rounded-lg"
                                                            disabled={false}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </section>
                    {modalEntry !== 0 && (
                        <footer className="flex items-center justify-center p-6 sticky bottom-0 h-20 bg-white">
                            <Button
                                width="w-full flex items-center justify-center"
                                containerClass="w-full"
                                roundedClass="rounded-full"
                                title={_STRINGS.DISCOVER_ADS}
                            />
                        </footer>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Page;
