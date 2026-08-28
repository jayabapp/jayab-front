import { colors } from "@/theme/colors";
const ProgressBar = ({
  progress,
  color = colors.danger[500],
  trackColor = `${colors.neutral[300]}80`,
}: {
  progress: number; // 0–100
  color?: string;
  trackColor?: string;
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div style={{ backgroundColor: trackColor }} className="w-full rounded-full h-1 relative">
        <div
          style={{
            backgroundColor: color,
            width: `${clampedProgress}%`,
          }}
          className="absolute rounded-full left-0 h-1 transition-all duration-500 ease-in-out"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
