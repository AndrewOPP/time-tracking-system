import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/utils';
import { CATEGORIES } from '../constants/constants';
import type { WeekInfo } from '../types/managerAIChat.types';

interface CategoryListProps {
  weeksInfo: WeekInfo[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryList = ({
  activeCategory,
  onSelectCategory,
  weeksInfo,
}: CategoryListProps) => {
  return (
    <div className="w-[245px] shrink-0 border-r border-[#E0E1E2] overflow-y-auto flex flex-col py-3 pl-2 pr-0 gap-1 custom-scrollbar">
      {CATEGORIES.map(categoty => {
        const Icon = categoty.icon;
        const isActive = activeCategory === categoty.id;

        const activeWeekCategory = weeksInfo.find(
          week => week.weekNumber === Number(categoty?.id[categoty.id.length - 1])
        );

        const weekCategoryDotColor =
          activeWeekCategory?.workingHours === 40 ? '#4E916B' : '#F97316';

        return (
          <button
            key={categoty.id}
            onClick={() => onSelectCategory(categoty.id)}
            className={cn(
              'w-full flex items-center gap-[12px] text-[14px] text-left transition-colors py-2 px-3 rounded-[6px] h-[34px] cursor-pointer w-[224px]',
              isActive
                ? 'bg-[#F4F4F5] font-medium text-[#1F1F1F]'
                : 'text-[#686868] hover:bg-[#F4F4F5]/50'
            )}
          >
            {Icon ? (
              <Icon
                className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#1F1F1F]' : 'text-[#A1A1AA]')}
              />
            ) : (
              <div
                className="h-[8px] w-[8px] rounded-full shrink-0"
                style={{ backgroundColor: weekCategoryDotColor || 'transparent' }}
              />
            )}
            <span className="truncate flex-1">{categoty.label}</span>
            {isActive && <ChevronRight className="h-4 w-4 shrink-0 ml-auto text-[#1F1F1F]" />}
          </button>
        );
      })}
    </div>
  );
};
