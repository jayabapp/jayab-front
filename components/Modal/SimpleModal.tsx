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
        <div className="rounded-2xl bg-white  mx-2">
            <div className="flex items-start justify-between p-6">
                <div className="flex flex-col flex-items-start gap-2">
                    {image && (
                        <Image alt="" src={image} width={34} height={34} />
                    )}
                    {subtitle && (
                        <span className="text-sm text-brand-600">
                            {subtitle}
                        </span>
                    )}
                </div>
                {title && <span>{title}</span>}
                <button onClick={onClick}>
                    <img src="/assets/icons/close.svg" alt="" />
                </button>
            </div>
            {children}
        </div>
    );
}

export default SimpleModal;
