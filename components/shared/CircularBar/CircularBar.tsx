import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularBarProps {
    value: number;
}

function CircularBar({ value }: CircularBarProps) {
    return (
        <div className="w-full">
            <CircularProgressbar value={value} text={value.toString()} />
        </div>
    );
}

export default CircularBar;
