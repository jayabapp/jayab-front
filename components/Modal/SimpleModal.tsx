import React from "react";
import Image from "next/image";

interface SimpleModalProps {
    title?: string;
    subtitle?: string;
    image?: string;
    children: React.ReactNode;
    onClick: () => void;
}

function SimpleModal({
    title,
    subtitle,
    image,
    children,
    onClick,
}: SimpleModalProps) {
    return (
        <div className="w-[375px] bg-white lg:shadow-card lg:rounded-2xl mx-auto rounded-2xl">
            <header className="flex items-start justify-between p-6">
                <div className="flex flex-col flex-items-start gap-2">
                    {image && (
                        <Image alt="" src={image} width={34} height={34} />
                    )}
                    {subtitle && (
                        <span className="text-sm text-primary-700">
                            {subtitle}
                        </span>
                    )}
                </div>
                {title && <span>{title}</span>}
                <button onClick={onClick}>
                    <img src="/assets/icons/close.svg" alt="" />
                </button>
            </header>
            {children}
        </div>
    );
}

export default SimpleModal;
