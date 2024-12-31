"use client";
import React from "react";

import { usePathname, useRouter } from "next/navigation";
// import _STRINGS from "@/utils/LocalStrings";
// import { useQuery } from "@tanstack/react-query";
// import { UserService } from "@/api_services/user/user.service";

interface PageFooterProps {
    title?: string;
    containerClass?: string;
    disableBack?: boolean;
    disableBell?: boolean;
    customeBackRoute?: string;
    customeBackFunc?: () => void | null;
    children?: React.ReactNode; // Add children prop
}

const PageFooter: React.FC<PageFooterProps> = ({
    title,
    containerClass,
    disableBack,
    disableBell,
    customeBackRoute,
    customeBackFunc,
    children,
}) => {
    return (
        <div
            className={`fixed  select-none z-[40] shadow-md   bg-white w-full transition-all bottom-0 left-0 h-16 px-6 flex items-center justify-between py-4`}
        >
            {children}
            {title && <p className="font-bold text-base">{title}</p>}
        </div>
    );
};

export default PageFooter;
