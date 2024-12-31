import React from "react";
import Link from "next/link";

import Button from "@/components/shared/Button/Button";
import PageHeaders from "@/components/headers/PageHeader";
import PageFooter from "@/components/Footer/PageFooter";

import _STRINGS from "@/utils/LocalStrings";

const Page: React.FC = () => {
    return (
        <div className="container items-center !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-6">
            <PageHeaders title={_STRINGS.RECORD_CONSULTANT_SCORE} />
            <main className="flex flex-col gap-6"></main>
            <PageFooter>
                <Button
                    width="flex items-center justify-center w-full"
                    containerClass="w-full"
                    roundedClass="rounded-full"
                    title={_STRINGS.RECORD_SCORE}
                />
            </PageFooter>
        </div>
    );
};

export default Page;
