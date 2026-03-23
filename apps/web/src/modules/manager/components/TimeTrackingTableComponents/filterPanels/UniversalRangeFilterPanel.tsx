import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui';

interface UniversalRangeFilterPanelProps {
  name: string;
  selectedMin: number | null;
  selectedMax: number | null;
  toggleMin: (value: number | null) => void;
  toggleMax: (value: number | null) => void;
}

const RANGE_OPTIONS = Array.from({ length: 9 }).map((_, index) => index * 25);
export const UniversalRangeFilterPanel = ({
  name,
  selectedMin,
  selectedMax,
  toggleMin,
  toggleMax,
}: UniversalRangeFilterPanelProps) => {
  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-[0.98] duration-500 p-5">
      <h3 className="text-base font-semibold mb-6 text-[#1F1F1F]">{name}</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#6F6F6F] ml-1">Minimum</label>
          <Select
            value={selectedMin !== null ? String(selectedMin) : 'all'}
            onValueChange={val => {
              if (val === 'all') toggleMin(null);
              else toggleMin(Number(val));
            }}
          >
            <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
              <SelectValue placeholder="Min" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
            >
              <SelectGroup>
                <SelectItem className="cursor-pointer" value="all">
                  Any
                </SelectItem>

                {RANGE_OPTIONS.filter(val => val !== 0).map(itemValue => (
                  <SelectItem
                    className="cursor-pointer"
                    key={`min-${itemValue}`}
                    value={String(itemValue)}
                    disabled={selectedMax !== null && itemValue > selectedMax}
                  >
                    {String(itemValue)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#6F6F6F] ml-1">Maximum</label>
          <Select
            value={selectedMax !== null ? String(selectedMax) : 'all'}
            onValueChange={val => {
              if (val === 'all') toggleMax(null);
              else toggleMax(Number(val));
            }}
          >
            <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
              <SelectValue placeholder="Max" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              sideOffset={4}
              className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
            >
              <SelectGroup>
                <SelectItem className="cursor-pointer" value="all">
                  Any
                </SelectItem>

                {RANGE_OPTIONS.filter(val => val !== 0).map(itemValue => (
                  <SelectItem
                    className="cursor-pointer"
                    key={`max-${itemValue}`}
                    value={String(itemValue)}
                    disabled={selectedMin !== null && itemValue < selectedMin}
                  >
                    {String(itemValue)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
