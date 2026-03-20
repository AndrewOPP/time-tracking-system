import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

interface UniversalFilterPanelProps<T> {
  items: T[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  idKey: keyof T;
  nameKey: keyof T;
  avatarKey?: keyof T;
  searchPlaceholder?: string;
  emptyStateText?: string;
}

export const UniversalFilterPanel = <T extends Record<string, unknown>>({
  items,
  selectedIds,
  onToggle,
  idKey,
  nameKey,
  avatarKey,
  searchPlaceholder = 'Search...',
  emptyStateText = 'No results found :(',
}: UniversalFilterPanelProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const lowerQuery = searchQuery.toLowerCase();

    return items.filter(item =>
      String(item[nameKey] || '')
        .toLowerCase()
        .includes(lowerQuery)
    );
  }, [items, searchQuery, nameKey]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-3 py-[12px] border-b border-[#E0E1E2]">
        <div className="relative flex items-center">
          <Search className="absolute left-[12px] h-4 w-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-[36px] pr-3 py-[6px] h-[32px] text-[14px] border border-[#E0E1E2] rounded-[6px] outline-none focus:border-gray-400 placeholder:text-[#A1A1AA]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1">
        {filteredItems.length === 0 ? (
          <div className="text-[14px] text-[#A1A1AA] text-center mt-4">{emptyStateText}</div>
        ) : (
          filteredItems.map((item, index) => {
            const itemId = String(item[idKey] || index);
            const itemName = String(item[nameKey] || 'Unnamed');
            const itemAvatar = avatarKey ? (item[avatarKey] as string) : null;
            const isSelected = selectedIds.has(itemId);

            return (
              <div
                key={itemId}
                onClick={() => onToggle(itemId)}
                className={`flex items-center gap-3 px-2 py-2 rounded-[6px] cursor-pointer transition-all ${
                  isSelected ? 'bg-[#1F1F1F] text-white' : 'hover:bg-[#F4F4F5] text-[#1F1F1F]'
                }`}
              >
                {itemAvatar ? (
                  <img
                    src={itemAvatar}
                    alt={itemName}
                    className="h-6 w-6 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-200 shrink-0" />
                )}

                <span
                  className={`text-[14px] leading-none truncate ${isSelected ? 'font-medium' : ''}`}
                >
                  {itemName}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
