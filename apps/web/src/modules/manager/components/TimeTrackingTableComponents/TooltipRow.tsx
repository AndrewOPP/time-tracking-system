import { formatHours } from '../../utils/formatHours';

interface TooltipRowProps {
  title: string;
  hoursValue: number;
  percent: number;
  color: string;
  dotColor?: string;
}

export const TooltipRow: React.FC<TooltipRowProps> = ({
  title,
  hoursValue,
  percent,
  color,
  dotColor,
}) => {
  const pureColor = color.replace(/\[|\]/g, '');
  const pureDotColor = dotColor?.replace(/\[|\]/g, '');

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: pureDotColor || pureColor }}
        />
        <span className="text-[#1F1F1F]">{title}</span>
      </div>
      <div className="text-right" style={{ color: pureColor }}>
        {percent}%
      </div>
      <div className="text-right" style={{ color: pureColor }}>
        [{formatHours(hoursValue)}]
      </div>
    </>
  );
};
