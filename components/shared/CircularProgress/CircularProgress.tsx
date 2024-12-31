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
}

const CircularProgress: React.FC<CircularProgressProps> = ({
    size,
    value,
    color = "#0070f3",
    label,
    subtitle,
    className,
}) => {
    return (
        <div
            className={`w-full flex flex-col sm:flex-row items-center gap-2 relative text-xs sm:text-sm ${className}`}
            style={{ color }}
        >
            <div className="flex items-center gap-1 sm:gap-2">
                {label && <span className="w-full font-semibold">{label}</span>}
                <div className={`relative max-w-full ${size}`}>
                    <CircularProgressbar
                        value={value}
                        text={`${value}`}
                        styles={buildStyles({
                            textColor: color,
                            pathColor: color,
                            textSize: "270%",
                        })}
                    />
                </div>
            </div>
            {subtitle && <span className="font-semibold">{subtitle}</span>}
        </div>
    );
};

export default CircularProgress;
