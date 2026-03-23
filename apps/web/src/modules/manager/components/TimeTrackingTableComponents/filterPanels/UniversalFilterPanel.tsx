import { useState, useMemo } from 'react';
import { FilterSearchInput } from './FilterSearchInput';
import { FilterListItem } from './FilterListItem';

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
    <div className="flex flex-col h-full animate-in fade-in zoom-in-[0.98] duration-500">
      <FilterSearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={searchPlaceholder}
      />

      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-1 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-[14px] text-[#A1A1AA] text-center mt-4">{emptyStateText}</div>
        ) : (
          filteredItems.map((item, index) => {
            const itemId = String(item[idKey] ?? index);
            const itemName = String(item[nameKey] || 'Unnamed');
            const itemAvatar = avatarKey ? (item[avatarKey] as string) : null;
            const isSelected = selectedIds.has(itemId);

            return (
              <FilterListItem
                key={itemId}
                name={itemName}
                avatarUrl={itemAvatar}
                isSelected={isSelected}
                onClick={() => onToggle(itemId)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
