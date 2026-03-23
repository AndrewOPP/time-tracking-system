import type { EmploymentFormatValue } from '@/modules/manager/constants/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui';

interface WorkFormatFilterPanelProps {
  selectedFormat: EmploymentFormatValue | null;
  setFormat: (val: EmploymentFormatValue | null) => void;
}

export const WorkFormatFilterPanel = ({
  selectedFormat,
  setFormat,
}: WorkFormatFilterPanelProps) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-[0.98] duration-500 p-5 ">
      <h3 className="text-base font-semibold mb-6 text-[#1F1F1F]">Employment Format</h3>

      <div className="w-full flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#6F6F6F] ml-1">Format</label>

        <Select
          value={selectedFormat !== null ? selectedFormat : 'all'}
          onValueChange={val => {
            if (val === 'all') {
              setFormat(null);
            } else {
              setFormat(val as EmploymentFormatValue);
            }
          }}
        >
          <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={4}
            className="w-[var(--radix-select-trigger-width)]"
          >
            <SelectGroup>
              <SelectItem className="cursor-pointer" value="all">
                All
              </SelectItem>
              <SelectItem className="cursor-pointer" value="FULL_TIME">
                Full-time
              </SelectItem>
              <SelectItem className="cursor-pointer" value="PART_TIME">
                Part-time
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
