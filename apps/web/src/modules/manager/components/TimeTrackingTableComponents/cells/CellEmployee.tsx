import { FastUserAvatar } from '../FastUserAvatar';

export const CellEmployee = ({ name, avatarUrl }: { name: string; avatarUrl: string | null }) => (
  <div className="flex items-center gap-2 px-5 w-[230px]">
    <FastUserAvatar src={avatarUrl ?? ''} name={name} className="h-4 w-4 shrink-0" />
    <span className="text-[14px] text-[#1F1F1F] font-medium truncate flex-1 w-[20px]" title={name}>
      {name}
    </span>
  </div>
);
