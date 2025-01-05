import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressProps {
    size: string;
    value: number;
    color: string;
    label?: string;
    subtitle?: string;
    className?: string;
    pStyles?: {
        textColor?: string;
        pathColor?: string;
        textSize?: string;
    };
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size,
    value,
    color = "#0070f3",
    label,
    subtitle,
    className,
    pStyles = {},
}) => {
    return (
        <div
            className={`w-full flex flex-col items-center gap-2 relative text-xs sm:text-sm md:text-base ${className}`}
            style={{ color: pStyles?.textColor }}
        >
            <div className="flex items-center gap-1">
                {label && <span className="text-nowrap">{label}: </span>}
                <div className={`relative inline-flex max-w-full ${size}`}>
                    <CircularProgressbar
                        value={value}
                        text={`${value}`}
                        styles={buildStyles(pStyles)}
                    />
                </div>
            </div>
            {subtitle && <span>{subtitle}</span>}
        </div>
    );
};

export default CircularProgress;
