import React from 'react';

interface CellListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const CellListInternal = <T extends { projectId?: string | number }>({
  items,
  renderItem,
}: CellListProps<T>) => (
  <div className="py-3 flex flex-col w-full px-4 gap-3">
    {items.map((item, index) => (
      <div key={item.projectId || index} className="flex items-center">
        {renderItem(item)}
      </div>
    ))}
  </div>
);

export const CellList = React.memo(CellListInternal, (prevProps, nextProps) => {
  return prevProps.items === nextProps.items;
}) as typeof CellListInternal;
