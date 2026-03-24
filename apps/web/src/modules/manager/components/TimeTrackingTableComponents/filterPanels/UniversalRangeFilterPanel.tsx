import { RangeDropdown } from './RangeDropdown';

interface UniversalRangeFilterPanelProps {
  name: string;
  selectedMin: number | null;
  selectedMax: number | null;
  toggleMin: (value: number | null) => void;
  toggleMax: (value: number | null) => void;
}

// // Заранее фильтруем нули, чтобы не делать это при каждом рендере списка
// const VALID_RANGE_OPTIONS = Array.from({ length: 9 })
//   .map((_, index) => index * 25)
//   .filter(val => val !== 0);

// interface RangeDropdownProps {
//   label: string;
//   placeholder: string;
//   selectedValue: number | null;
//   onChange: (value: number | null) => void;
//   isOptionDisabled: (optionValue: number) => boolean;
// }

// // Выносим повторяющийся UI селекта в локальный компонент
// const RangeDropdown = ({
//   label,
//   placeholder,
//   selectedValue,
//   onChange,
//   isOptionDisabled,
// }: RangeDropdownProps) => (
//   <div className="flex flex-col gap-1.5">
//     <label className="text-[13px] font-medium text-[#6F6F6F] ml-1">{label}</label>
//     <Select
//       value={selectedValue !== null ? String(selectedValue) : 'all'}
//       onValueChange={val => onChange(val === 'all' ? null : Number(val))}
//     >
//       <SelectTrigger className="w-full h-10 border-[#E0E1E2] bg-white shadow-sm hover:border-gray-400 transition-colors cursor-pointer">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>

//       <SelectContent
//         position="popper"
//         sideOffset={4}
//         className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)]"
//       >
//         <SelectGroup>
//           <SelectItem className="cursor-pointer" value="all">
//             Any
//           </SelectItem>

//           {VALID_RANGE_OPTIONS.map(itemValue => (
//             <SelectItem
//               className="cursor-pointer"
//               key={`${label}-${itemValue}`}
//               value={String(itemValue)}
//               disabled={isOptionDisabled(itemValue)}
//             >
//               {String(itemValue)}
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   </div>
// );

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
        <RangeDropdown
          label="Minimum"
          placeholder="Min"
          selectedValue={selectedMin}
          onChange={toggleMin}
          isOptionDisabled={val => selectedMax !== null && val > selectedMax}
        />

        <RangeDropdown
          label="Maximum"
          placeholder="Max"
          selectedValue={selectedMax}
          onChange={toggleMax}
          isOptionDisabled={val => selectedMin !== null && val < selectedMin}
        />
      </div>
    </div>
  );
};
