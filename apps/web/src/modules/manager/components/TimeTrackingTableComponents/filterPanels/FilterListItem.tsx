interface FilterListItemProps {
  name: string;
  avatarUrl?: string | null;
  isSelected: boolean;
  onClick: () => void;
}

export const FilterListItem = ({ name, avatarUrl, isSelected, onClick }: FilterListItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-[6px] cursor-pointer transition-all h-[34px] ${
        isSelected ? 'bg-[#ebebeb] text-[#1F1F1F]' : 'hover:bg-[#ebebeb] text-[#1F1F1F]'
      }`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-4 w-4 rounded-full object-cover shrink-0" />
      ) : (
        <div className="h-4 w-4 rounded-full bg-gray-200 shrink-0" />
      )}

      <span className={`text-[14px] leading-none truncate ${isSelected ? 'font-medium' : ''}`}>
        {name}
      </span>
    </div>
  );
};
