"use client";
import { AuthService } from "@/api_services/auth/auth.service";
import CreateEditProperty from "@/components/Adds/CreateEditProperty";
import PageHeaders from "@/components/headers/PageHeader";
import ConsultantCard from "@/components/Consultants/ConsultantCard";
import StepShower from "@/components/shared/StepShower";
import { createPropertySteps } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "@/components/shared/Button/Button";
import FormInput from "@/components/shared/Form/FormInput";
import SearchBox from "@/components/SearchBoxComp";

const Page = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useQuery({
        queryKey: [AuthService.AU4_CACHEKEY],
        queryFn: AuthService.GetProfile,
    });
    const [values, setValues] = useState<{
        name: string;
        national_code: string;
        property_type: string;
    }>({
        national_code: "",
        name: "",
        property_type: "",
    });
    useEffect(() => {
        if (!!data) {
            if (!data?.owner_id) {
                router.push(`/profile/edit?redirect_url=${pathname}`);
            }
        }
    }, [data]);

    return (
        <div
            id="homeParent"
            className="container  items-center  !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6 "
        >
            <PageHeaders title={_STRINGS.CONSULTANT_INFO} />

            <header className="w-full flex flex-col"> {/* gap-6 */}
                <FormInput
                    value={values?.name}
                    onChangeText={(e) => {
                        // onChange(e, "name");
                    }}
                    item={{
                        iconUrl: "/assets/icons/search/search-icon.svg",
                        isMandatory: true,
                        containerClass: "w-full",
                        placeholder: _STRINGS.SEARCH_FOR_CONSULTANTS,
                    }}
                />
                {/* <div className="w-full">
                    <SearchBox
                        placeholder={_STRINGS.SEARCH_FOR_CONSULTANTS}
                        onSubmit={(query) =>
                            console.log("Search submitted:", query)
                        }
                        onClear={() => console.log("Search cleared")}
                        autofocus={true}
                    />
                </div> */}
                <div className="flex items-center justify-between">
                    <span>جستجو در کردان و سه شهر دیگر</span>
                </div>
                {/* <Button
                    width="w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.CHOOSE_STATE_AND_CITY}
                /> */}
            </header>
            <main className="w-full grid lg:grid-cols-2 gap-6">
                <ConsultantCard />
                <ConsultantCard />
                <ConsultantCard />
            </main>
        </div>
    );
};

export default Page;
